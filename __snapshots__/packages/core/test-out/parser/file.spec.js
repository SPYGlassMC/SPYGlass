exports['file() Parse "" 1'] = {
  "node": {
    "type": "file",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": [
      {
        "type": "test",
        "range": {
          "start": 0,
          "end": 0
        },
        "value": ""
      }
    ],
    "parserErrors": []
  },
  "errors": []
}

exports['file() Parse "{test content}" 1'] = {
  "node": {
    "type": "file",
    "range": {
      "start": 0,
      "end": 14
    },
    "children": [
      {
        "type": "test",
        "range": {
          "start": 0,
          "end": 14
        },
        "value": "{test content}"
      }
    ],
    "parserErrors": []
  },
  "errors": []
}

exports['file() Parse "{test content}↓Whoops errors!" 1'] = {
  "node": {
    "type": "file",
    "range": {
      "start": 0,
      "end": 29
    },
    "children": [
      {
        "type": "test",
        "range": {
          "start": 0,
          "end": 14
        },
        "value": "{test content}"
      },
      {
        "type": "error",
        "range": {
          "start": 15,
          "end": 29
        }
      }
    ],
    "parserErrors": [
      {
        "range": {
          "start": 15,
          "end": 29
        },
        "message": "Encountered unparseable content",
        "severity": 3
      }
    ]
  },
  "errors": []
}

exports['file() Parse "{test content}↓⮀" 1'] = {
  "node": {
    "type": "file",
    "range": {
      "start": 0,
      "end": 16
    },
    "children": [
      {
        "type": "test",
        "range": {
          "start": 0,
          "end": 14
        },
        "value": "{test content}"
      }
    ],
    "parserErrors": []
  },
  "errors": []
}

exports['file() Parse with an entry parser returning null 1'] = {
  "node": {
    "type": "file",
    "range": {
      "start": 0,
      "end": 0
    },
    "children": [],
    "parserErrors": []
  },
  "errors": []
}
