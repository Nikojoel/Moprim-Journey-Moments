package com.journeymoments

import fi.moprim.tmd.sdk.model.TmdActivity
import java.util.*

data class CustomMoprimActivity(
        val TmdActivity: TmdActivity,
        val activity: String,
        val id: Long,
        val timestampStart: Long,
        val timestampEnd: Long,
        val co2: Double,
        val distance: Double,
        val speed: Double,
        val polyline: String,
        val origin: String,
        val destination: String,
        val userId: String
)

data class TravelChain(
        val id: MutableList<String> = mutableListOf<String>(),
        var totalCo2: Double = 0.0,
        var totalDistance: Double = 0.0,
        var userId: String
)

data class Chain(
        val activities: List<TmdActivity>,
        val date: Date
)
