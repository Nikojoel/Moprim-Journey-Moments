package com.journeymoments

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*
import com.google.gson.Gson
import fi.moprim.tmd.sdk.TMD
import fi.moprim.tmd.sdk.TmdCloudApi
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers
import io.reactivex.rxjava3.core.Observable
import io.reactivex.rxjava3.schedulers.Schedulers.io
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
    fun getResults(promise: Promise) {
        Observable
                .just(1)
                .observeOn(io())
                .map {
                    TmdCloudApi.uploadData(context)
                    TmdCloudApi.fetchData(context, Date())
                }
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe {
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