/*
* adapt-contrib-results
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Daryl Hedley <darylhedley@hotmail.com>
*/
define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

    var Results = ComponentView.extend({

        events: {
            'click .associatedLearning-link': 'onLinkClicked'
        },

        preRender: function () {
            this.listenTo(Adapt, 'assessment:complete', this.onAssessmentComplete);

            // if not already hidden via a plugin
            var hide = (!this.model.get('_completeInSession') || (this.model.get('_isComplete') &&  this.model.get('_isEnabledOnRevisit'))); 
            //console.log("results.js: " + this.model.get('_isComplete') + " - " + this.model.get('_isEnabledOnRevisit') + " - " + hide);
           
            //console.log("results, is visible?: " + this.model.get('_isVisible'));
            if (this.model.get('_isVisible') && hide) {
                this.model.set('_isHidden', true);
                this.$el.addClass('visibility-hidden');
            }
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

            // if hidden internally - not via a plugin
            if (this.model.get('_isHidden')) {
                this.model.set('_isHidden', false);
                this.$el.removeClass('visibility-hidden');
            }

            this.render();
        },

        onLinkClicked: function(event) {
            event.preventDefault();
            
            var currentTarget = $(event.currentTarget);
            var type = currentTarget.data('type');

            Adapt.navigateToElement(currentTarget.data('id'), currentTarget.data('type'))
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if(this.model.get('_isHidden')) return;
            console.log("results.js,inview, visible: " + visible);
            if (visible) {
                console.log("visiblePartY: " + visiblePartY);
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
                    this.model.set('_completeInSession', true);
                }
                
            }
        }
        
    });
    
    Adapt.register("results", Results);
    
});