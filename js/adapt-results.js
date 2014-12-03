/*
* adapt-assessment-results
* License - https://github.com/cgkineo/adapt-assessment-results/LICENSE
* Maintainers - Dan Ghost <daniel.ghost@kineo.com>, Gavin McMaster <gavin.mcmaster@kineo.com>
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
            var hide = (!this.model.get('_completeInSession') || (this.model.get('_completeInSession') &&  this.model.get('_isEnabledOnRevisit')));
            if (hide) this.model.set('_isVisible', false, {pluginName: '_results'});
        },

        postRender: function() {
            this.setReadyStatus();
            this.$('.component-inner').on('inview', _.bind(this.inview, this));
        },

        onAssessmentComplete: function(data) {
            this.model.set({
               'feedbackMessage': data.feedbackMessage, 
              '_associatedLearning': data.associatedLearning
            });

            if (!this.model.get('_isVisible')) this.model.set('_isVisible', true, {pluginName: '_results'});

            this.render();
        },

        onLinkClicked: function(event) {
            event.preventDefault();
            
            var currentTarget = $(event.currentTarget);
            var type = currentTarget.data('type');

            Adapt.navigateToElement(currentTarget.data('id'), currentTarget.data('type'))
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (this.model.get('_isHidden')) return;

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
                    this.$('.component-inner').off('inview');
                    this.setCompletionStatus();
                    this.model.set('_completeInSession', true);
                }
            }
        }
        
    });
    
    Adapt.register("results", Results);
    
});