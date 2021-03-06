exports['SymbolUtil enter() Should enter multiple symbols 1'] = [
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 1,
        "definition": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 5,
              "end": 5
            }
          }
        ]
      }
    }
  },
  {},
  {
    "nbtdoc": {
      "test": {
        "category": "nbtdoc",
        "identifier": "test",
        "visibility": 0,
        "definition": [
          {
            "uri": "file:///test.nbtdoc",
            "range": {
              "start": 4,
              "end": 4
            }
          }
        ]
      }
    }
  }
]

exports['SymbolUtil enter() Should enter multiple symbols 2'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 3,
      "definition": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 1,
            "end": 1
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 6,
            "end": 6
          }
        }
      ],
      "reference": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 2,
            "end": 2
          }
        },
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 3,
            "end": 3
          }
        }
      ],
      "visibilityRestriction": [
        "spgoding:**"
      ]
    },
    "test2": {
      "category": "nbtdoc",
      "identifier": "test2",
      "visibility": 2,
      "definition": [
        {
          "uri": "file:///test.nbtdoc",
          "range": {
            "start": 7,
            "end": 7
          }
        }
      ]
    }
  }
}

exports['SymbolUtil open() Should remove all URIs of the file before opening 1'] = {
  "nbtdoc": {
    "test": {
      "category": "nbtdoc",
      "identifier": "test",
      "visibility": 2,
      "definition": [
        {
          "uri": "file:///another_test.nbtdoc",
          "range": {
            "start": 1,
            "end": 1
          }
        }
      ]
    }
  }
}
