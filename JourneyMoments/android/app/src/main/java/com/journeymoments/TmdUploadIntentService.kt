package com.journeymoments

import android.app.IntentService
import android.content.Intent
import android.util.Log
import fi.moprim.tmd.sdk.model.Result
import fi.moprim.tmd.sdk.model.TmdUploadMetadata

/**
 * An [IntentService] subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 *
 *
 * This intent service can be use to perform operations when data has been uploaded to the Moprim Cloud
 * helper methods.
 */
class TmdUploadIntentService : IntentService(TAG) {
    override fun onHandleIntent(intent: Intent?) {
        if (TmdUploadMetadata.hasResult(intent)) {
            handleTmdUploadMetadataResult(TmdUploadMetadata.extractResult(intent))
        }
    }

    /**
     * Handle the upload metadata result
     * @param result the TmdUploadMetadata result for the periodic data upload service
     */
    private fun handleTmdUploadMetadataResult(result: Result<TmdUploadMetadata>) {
        Log.i(TAG, result.toString())
    }

    companion object {
        private val TAG = TmdUploadIntentService::class.java.simpleName
    }
}