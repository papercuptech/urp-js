import {
  ACTIONS,
  TOPIC,
} from '../src/message-constants'

import {
  hasCorrelationId,
  validate,
} from '../src/message-validator'

import {
  reverseMap,
} from '../src/utils'

const ACTIONS_BYTE_TO_KEY = {}
for (const key in ACTIONS) {
  ACTIONS_BYTE_TO_KEY[key] = reverseMap(ACTIONS[key])
}

import { MESSAGES } from './messages'

describe('protocol', () => {
  for (const topic in ACTIONS) {
    for (const action in ACTIONS[topic]) {
      if (isNaN(Number(action))) {
        it (`contains message for ${TOPIC[topic]} with action ${action} in protocol`, () => {
         expect(MESSAGES[topic][action]).toBeDefined()
        })
      } else {
        it (`contains topic ${TOPIC[topic]} with action ${ACTIONS[topic][action]} in protocol`, () => {
          expect(ACTIONS_BYTE_TO_KEY[topic][action]).toBeDefined()
        })
      }
    }
  }
})

describe('message params', () => {
  for (const topicStr in MESSAGES) {
    const topic: TOPIC = Number(topicStr)
    for (const actionStr in MESSAGES[topic]) {
      const spec = MESSAGES[topic][actionStr]
      const action = ACTIONS[topic][actionStr]
      it (`spec for topic ${TOPIC[topic]} with action ${actionStr} is valid`, () => {
        if (spec && !spec.message.parseError) {
          expect(validate(spec.message)).not.toBeDefined()
        }
      })
      it (`argument specification is correct for topic ${TOPIC[topic]} with action ${actionStr}`, () => {
        if (spec && spec.urp.args.indexOf('correlationId') !== -1) {
          expect(hasCorrelationId(topic, action)).toEqual(true)
        } else {
          expect(hasCorrelationId(topic, action)).toEqual(false)
        }
      })
    }
  }
})