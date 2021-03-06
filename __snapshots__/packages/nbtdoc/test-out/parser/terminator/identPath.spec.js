exports['identPath() Parse "" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 0
        },
        "value": ""
      }
    ],
    "range": {
      "start": 0,
      "end": 0
    }
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

exports['identPath() Parse "::foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": true,
    "children": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 2,
          "end": 5
        },
        "value": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identPath() Parse "foo" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 3
    }
  },
  "errors": []
}

exports['identPath() Parse "foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 0,
          "end": 3
        },
        "value": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 5,
          "end": 8
        },
        "value": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 8
    }
  },
  "errors": []
}

exports['identPath() Parse "super::foo something else;" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "super"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identPath() Parse "super::foo" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "super"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "foo"
      }
    ],
    "range": {
      "start": 0,
      "end": 10
    }
  },
  "errors": []
}

exports['identPath() Parse "super::foo::bar" 1'] = {
  "node": {
    "type": "nbtdoc:ident_path",
    "fromGlobalRoot": false,
    "children": [
      {
        "type": "nbtdoc:literal",
        "range": {
          "start": 0,
          "end": 5
        },
        "value": "super"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 7,
          "end": 10
        },
        "value": "foo"
      },
      {
        "type": "nbtdoc:identifier",
        "range": {
          "start": 12,
          "end": 15
        },
        "value": "bar"
      }
    ],
    "range": {
      "start": 0,
      "end": 15
    }
  },
  "errors": []
}
