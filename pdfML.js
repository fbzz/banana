var limdu = require('limdu');
var arrayOfTraining = [];
class pdfML {
  constructor() {
    // First, define our base classifier type (a multi-label classifier based on winnow):
    this.TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
      binaryClassifierType: limdu.classifiers.Winnow.bind(0, {
        retrain_count: 10
      })
    });

    // Now define our feature extractor - a function that takes a sample and adds features to a given features set:
    this.WordExtractor = function(input, features) {
      input.split(' ').forEach(function(word) {
        features[word] = 1;
      });
    };

    // Initialize a classifier with the base classifier type and the feature extractor:
    this.intentClassifier = new limdu.classifiers.EnhancedClassifier({
      classifierType: this.TextClassifier,
      normalizer: limdu.features.LowerCaseNormalizer,
      featureExtractor: this.WordExtractor
    });

    // Train and test:
    this.generateTrainBatch = function() {
      var arrayTrain = [];
      for (let i = 0; i <= 1000; i++) {
        arrayTrain.push({ input: i.toString(), output: 'normal_number' });
        arrayTrain.push({
          input: i.toString() + '-',
          output: 'question_start'
        });
        arrayTrain.push({
          input: i.toString() + '-)',
          output: 'question_start'
        });
        arrayTrain.push({
          input: i.toString() + '.',
          output: 'question_start'
        });
        arrayTrain.push({
          input: i.toString() + '.)',
          output: 'question_start'
        });
        arrayTrain.push({
          input: i.toString() + ')',
          output: 'question_start'
        });
      }

      //EXAMPLES OF TRAINING FOR QUIESTIONS BODY
      arrayTrain.push({
        input: 'abcdefghijklmnopqrstuvywz',
        output: 'question_body'
      });
      arrayTrain.push({
        input: 'De acordo com o texto, o que podemos observar nessa foto',
        output: 'question_body'
      });
      arrayTrain.push({ input: 'Qual seu pai', output: 'question_body' });
      arrayTrain.push({ input: 'Qual algo ', output: 'question_body' });
      arrayTrain.push({ input: 'Qual seria', output: 'question_body' });
      arrayTrain.push({
        input:
          'Por que será que existem essas normas? Escolha a alternativa que melhor justifica essas normas',
        output: 'question_body'
      });
      arrayTrain.push({
        input:
          'Vamos fazer um exercício. Pegue um mapa do Brasil e tente descobrir que estado não fazia parte do território brasileiro no século XVIII',
        output: 'question_body'
      });
      arrayTrain.push({
        input:
          'Analisando o Gráfico, é possível observar que a população das cidades passou a ser maior que a do campo',
        output: 'question_body'
      });
      arrayTrain.push({
        input:
          'De acordo com o texto, o que torna a água motivo de conflito é o fato de',
        output: 'question_body'
      });

      arrayTrain.push({ input: 'R:', output: 'question_answer' });
      arrayTrain.push({ input: 'R.', output: 'question_answer' });

      return arrayTrain;
    };

    this.arrayOfTraining = this.generateTrainBatch();
    this.intentClassifier.trainBatch(this.arrayOfTraining);

    console.dir(this.intentClassifier.classify('DEPENDE DE ALGO OU NAO'));
  }

  analyzeText(text) {
    console.log(this.intentClassifier.classify(text));
  }
}
module.exports = pdfML;
