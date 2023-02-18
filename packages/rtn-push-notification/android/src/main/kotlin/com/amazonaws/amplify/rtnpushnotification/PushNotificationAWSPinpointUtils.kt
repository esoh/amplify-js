// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

package com.amazonaws.amplify.rtnpushnotification

import android.os.Bundle
import com.amplifyframework.pushnotifications.pinpoint.utils.NotificationPayload
import com.amplifyframework.pushnotifications.pinpoint.utils.PushNotificationsConstants
import com.amplifyframework.pushnotifications.pinpoint.utils.toNotificationsPayload
import com.google.firebase.messaging.RemoteMessage

private const val PAYLOAD_KEY = "payload"

fun isRemoteMessageSupported(remoteMessage: RemoteMessage): Boolean {
    return !remoteMessage.data["pinpoint.campaign.campaign_id"].isNullOrEmpty()
}

fun getPayloadFromRemoteMessage(remoteMessage: RemoteMessage): NotificationPayload {
    val messageId = remoteMessage.messageId
    val senderId = remoteMessage.senderId
    val sendTime = remoteMessage.sentTime
    val data = remoteMessage.data
    val body = remoteMessage.notification?.body
        ?: data[PushNotificationsConstants.MESSAGE_ATTRIBUTE_KEY]
        ?: data[PushNotificationsConstants.PINPOINT_NOTIFICATION_BODY]
    val title = remoteMessage.notification?.title
        ?: data[PushNotificationsConstants.TITLE_ATTRIBUTE_KEY]
        ?: data[PushNotificationsConstants.PINPOINT_NOTIFICATION_TITLE]
    val imageUrl = remoteMessage.notification?.imageUrl?.toString()
        ?: data[PushNotificationsConstants.IMAGEURL_ATTRIBUTE_KEY]
        ?: data[PushNotificationsConstants.PINPOINT_NOTIFICATION_IMAGEURL]
    val action: HashMap<String, String> = HashMap()
    data[PushNotificationsConstants.PINPOINT_OPENAPP]?.let {
        action.put(PushNotificationsConstants.PINPOINT_OPENAPP, it)
    }
    data[PushNotificationsConstants.PINPOINT_URL]?.let {
        // force HTTPS URL scheme
        val urlHttps = it.replaceFirst("http://", "https://")
        action.put(PushNotificationsConstants.PINPOINT_URL, urlHttps)
    }
    data[PushNotificationsConstants.PINPOINT_DEEPLINK]?.let {
        action.put(PushNotificationsConstants.PINPOINT_DEEPLINK, it)
    }

    return NotificationPayload {
        notification(messageId, senderId, sendTime)
        notificationContent(title, body, imageUrl)
        notificationOptions(PushNotificationsConstants.DEFAULT_NOTIFICATION_CHANNEL_ID)
        tapAction(action)
        silentPush = data[PushNotificationsConstants.PINPOINT_NOTIFICATION_SILENTPUSH].equals("1")
        rawData = HashMap(remoteMessage.data)
    }
}

fun getPayloadFromExtras(extras: Bundle?): NotificationPayload? {
    return extras?.getBundle(PAYLOAD_KEY)?.toNotificationsPayload()
}