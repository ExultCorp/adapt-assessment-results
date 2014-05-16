/*
* adapt-contrib-results
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Daryl Hedley <darylhedley@hotmail.com>
*/
define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

    var Results = ComponentView.extend({

        preRender: function () {
            this.listenTo(Adapt, 'assessment:complete', this.onAssessmentComplete);
        },

        postRender: function() {
            this.setReadyStatus();
            this.$('.component-body').on('inview', _.bind(this.inview, this));
        },

        onAssessmentComplete: function(data) {
            this.model.set({
               'feedbackMessage': data.feedbackMessage, 
              '_associatedLearning': data.associatedLearning
            });

            this.render();
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-body').off('inview');
                    this.setCompletionStatus();
                }
                
            }
        }
        
    });
    
    Adapt.register("results", Results);
    
});