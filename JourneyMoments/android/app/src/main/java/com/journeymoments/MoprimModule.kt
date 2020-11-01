package com.journeymoments

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import fi.moprim.tmd.sdk.TMD
import fi.moprim.tmd.sdk.TmdCloudApi
import fi.moprim.tmd.sdk.TmdCoreConfigurationBuilder
import fi.moprim.tmd.sdk.model.TmdError
import fi.moprim.tmd.sdk.model.TmdInitListener
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.core.Observable
import io.reactivex.rxjava3.kotlin.subscribeBy
import io.reactivex.rxjava3.schedulers.Schedulers.io
import java.sql.Timestamp
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*


class MoprimModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule() {
    private val CHANNEL_ID = "moprim.channel"
    private var notificationManager: NotificationManager? = null
    private val gson = Gson()


    @ReactMethod
    fun show(message: String?) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }

    @ReactMethod
    fun start() {
        Log.i("XXX", "create channel")
        notificationManager = createNotificationChannel()
        val notification = buildNotification("moprim is running")
        TMD.startForeground(context, 112, notification)
    }

    @ReactMethod
    fun stop() {
        Log.i("XXX", "stop moprim")
        TMD.stop(context)
        notificationManager?.cancel(112)
    }

    @ReactMethod
    fun getResults(day: Int, promise: Promise) {
        Log.i("XXX", day.toString())
        Observable
                .just(day)
                .observeOn(io())
                .map {
                    convertToDate(LocalDateTime.now().minusDays(it.toLong()))?.let { date -> TmdCloudApi.fetchData(context, date) }
                }
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
                    if (it != null) {
                        Log.i("XXX", it.result.toString())
                        if (it.hasResult()) {
                            val json = gson.toJson(it.result)
                            promise.resolve(json)
                        }
                        if (it.hasError()) {
                            promise.reject("ERROR", it.error.toString())
                        }
                    }
                }
    }

    @ReactMethod
    fun uploadMoprim() {
        Observable
                .just(Unit)
                .observeOn(io())
                .subscribe {
                    TmdCloudApi.uploadData(context)
                }
    }

    @ReactMethod
    fun initMoprim(id: String) {
        val builder = TmdCoreConfigurationBuilder(context)
                .setSdkConfigEndPoint(apiRoot)
                .setSdkConfigKey(apiKey)
        // Init the TMD

        TMD.setUUID(id)
        TMD.init(context.applicationContext as Application, builder.build(), object : TmdInitListener {

            override fun onTmdInitFailed(tmdError: TmdError) {
                Log.e(
                        "XXX",
                        "Initialisation failed: " + tmdError.name
                )
            }

            override fun onTmdInitSuccessful(s: String) {
                // s is the current installation ID, we'll put the UUID as the same just to demonstrate how to use the method
                // replace with your own user id in production
                // TMD.setUUID(s);
                Log.i(
                        "XXX",
                        "Initialization successful with id: $id"
                )
                start()
                val intent =
                        Intent(context, TmdUploadIntentService::class.java)
                val callbackIntent = PendingIntent.getService(
                        context, 0, intent,
                        PendingIntent.FLAG_UPDATE_CURRENT
                )
                TmdCloudApi.setUploadCallbackIntent(callbackIntent)
            }
        })


    }

    fun convertToDate(dateToConvert: LocalDateTime): Date? {
        return Date
                .from(dateToConvert.atZone(ZoneId.systemDefault())
                        .toInstant())
    }


    private fun buildNotification(notificationText: String): Notification? {
        // Create notification builder.
        val notificationBuilder: NotificationCompat.Builder = NotificationCompat.Builder(context, CHANNEL_ID)
        notificationBuilder.setWhen(System.currentTimeMillis())
        notificationBuilder.setSmallIcon(android.R.drawable.ic_media_play)
        notificationBuilder.setContentTitle("TMD demo")
        notificationBuilder.setContentText(notificationText)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            notificationBuilder.priority = NotificationManager.IMPORTANCE_HIGH
        }

        // Build the notification.
        return notificationBuilder.build()
    }

    private fun createNotificationChannel(): NotificationManager? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "channel name"
            val descriptionText = "channel description"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            // Register the channel with the system
            val notificationManager: NotificationManager =
                    context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
            return notificationManager
        }
        return null
    }

    override fun getName(): String {
        return "MoprimBridge"
    }
}