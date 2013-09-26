function GameViewModel(game) {
    var self = this;
    self.date = game.date;
    self.home = game.home;
    self.away = game.away;
    self.pick = game.pick;
    self.allowDraw = game.allowDraw;
    self.score = game.score;
    self.id = game.id;
    self.hasBegun = game.hasBegun;
    self.isCorrect = game.isCorrect;
    self.name = game.home + ' vs ' + game.away;
    self.getPickName = function() {
        switch (self.pick.toLowerCase())
            {
                case 'home':
                    return self.home;
                case 'away':
                    return self.away;
                default:
                    return "Draw";
            }       
    };
}