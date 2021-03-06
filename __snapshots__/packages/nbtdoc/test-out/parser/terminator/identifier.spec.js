exports['identifier() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 0
    },
    "value": ""
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 0
      },
      "message": "Expected an identifier",
      "severity": 3
    }
  ]
}

exports['identifier() Parse "123" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "123"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 3
      },
      "message": "“123” doesn't follow the format of “/^[A-Za-z_][A-Za-z0-9_]*$/”",
      "severity": 3
    }
  ]
}

exports['identifier() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['identifier() Parse "foo()bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['identifier() Parse "foo123" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 6
    },
    "value": "foo123"
  },
  "errors": []
}

exports['identifier() Parse "foo;bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['identifier() Parse "foo↓bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 3
    },
    "value": "foo"
  },
  "errors": []
}

exports['identifier() Parse "foo你好;bar" 1'] = {
  "node": {
    "type": "nbtdoc:identifier",
    "range": {
      "start": 0,
      "end": 5
    },
    "value": "foo你好"
  },
  "errors": [
    {
      "range": {
        "start": 0,
        "end": 5
      },
      "message": "“foo你好” doesn't follow the format of “/^[A-Za-z_][A-Za-z0-9_]*$/”",
      "severity": 3
    }
  ]
}
