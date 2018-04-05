var limdu = require('limdu');
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
    this.intentClassifier.trainBatch([
      { input: '1', output: 'normal_number' },
      { input: '1-', output: 'question_start' },
      { input: '1)', output: 'question_start' },
      { input: '1.', output: 'question_start' },
      { input: '1.)', output: 'question_start' },
      { input: 'I want chips', output: 'cps' }
    ]);

    console.dir(this.intentClassifier.classify('1'));
  }
}
module.exports = pdfML;
