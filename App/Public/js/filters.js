'use strict';

pickem.filter('pickButtonClasses', function() {
    return function(input) {
        var classes = ['btn', 'btn-pick'];

        if (input.game.score == null && input.game.pick == input.option) {
            classes.push('active');
        }
        else if(input.game.isCorrect && input.game.pick == input.option) {
            classes.push('correct');
        }
        else if(!input.game.isCorrect && input.game.pick == input.option) {
            classes.push('incorrect');
        }
        
        if (input.game.hasBegun || input.game.score != null) {
            classes.push('cursor-default');
        }
        
        var cssClasses = classes.join(' ');
        
        return cssClasses;
    };
});