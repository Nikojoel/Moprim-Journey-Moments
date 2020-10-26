package com.journeymoments

import android.app.Application
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.*
import com.facebook.soloader.SoLoader

import fi.moprim.tmd.sdk.TMD
import fi.moprim.tmd.sdk.TmdCloudApi
import fi.moprim.tmd.sdk.TmdCoreConfigurationBuilder
import fi.moprim.tmd.sdk.model.TmdError
import fi.moprim.tmd.sdk.model.TmdInitListener
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {
    private val mReactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages
            packages.add(MoprimPackage())
            return packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this,  /* native exopackage */false)
        initializeFlipper(this, reactNativeHost.reactInstanceManager)
        initMoprim()
    }

    private fun initMoprim() {
        Log.i("XXX", "init" + MainApplication::class.java.simpleName)
        val builder = TmdCoreConfigurationBuilder(this)
                .setSdkConfigEndPoint(apiRoot)
                .setSdkConfigKey(apiKey)
        // Init the TMD
        TMD.init(this, builder.build(), object : TmdInitListener {
            override fun onTmdInitFailed(tmdError: TmdError) {
                Log.e(
                        MainApplication::class.java.simpleName,
                        "Initialisation failed: " + tmdError.name
                )
            }

            override fun onTmdInitSuccessful(s: String) {
                // s is the current installation ID, we'll put the UUID as the same just to demonstrate how to use the method
                // replace with your own user id in production
                // TMD.setUUID(s);
                Log.i(
                        MainApplication::class.java.simpleName,
                        "Initialization successful with id: $s"
                )
                val intent =
                        Intent(this@MainApplication, TmdUploadIntentService::class.java)
                val callbackIntent = PendingIntent.getService(
                        this@MainApplication, 0, intent,
                        PendingIntent.FLAG_UPDATE_CURRENT
                )
                TmdCloudApi.setUploadCallbackIntent(callbackIntent)
            }
        })
    }

    companion object {
        /**
         * Loads Flipper in React Native templates. Call this in the onCreate method with something like
         * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
         *
         * @param context
         * @param reactInstanceManager
         */
        private fun initializeFlipper(
                context: Context, reactInstanceManager: ReactInstanceManager) {
            if (BuildConfig.DEBUG) {
                try {
                    /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                    val aClass = Class.forName("com.journeymoments.ReactNativeFlipper")
                    aClass
                            .getMethod("initializeFlipper", Context::class.java, ReactInstanceManager::class.java)
                            .invoke(null, context, reactInstanceManager)
                } catch (e: ClassNotFoundException) {
                    e.printStackTrace()
                } catch (e: NoSuchMethodException) {
                    e.printStackTrace()
                } catch (e: IllegalAccessException) {
                    e.printStackTrace()
                } catch (e: InvocationTargetException) {
                    e.printStackTrace()
                }
            }
        }
    }
}