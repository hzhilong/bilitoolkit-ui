import { parseVideoZoneV1, type VideoZoneV1Id, parseVideoZoneV2, type VideoZoneV2Id } from '@ybgnb/bili-api'
import type { VideoInfoSnapshot } from 'bilitoolkit-types'

export const parseVideoZoneLabel = (video: VideoInfoSnapshot) => {
  const zoneV1 = parseVideoZoneV1(video.tid as VideoZoneV1Id)
  const zoneV2 = parseVideoZoneV2(video.tid_v2 as VideoZoneV2Id)

  if (zoneV2) {
    if (!zoneV2.subZoneName) {
      return zoneV2.mainZoneName
    }
    return `${zoneV2.mainZoneName} > ${zoneV2.subZoneName}`
  }
  if (zoneV1) {
    if (!zoneV1.subZoneName) {
      return zoneV1.mainZoneName
    }
    return `${zoneV1.mainZoneName} > ${zoneV1.subZoneName}`
  }
  return ''
}
