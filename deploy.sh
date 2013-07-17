if [ "$1" == '' ]; then
    echo "No deploy's target name supplied"
else
    git update-index --no-assume-unchanged Config.js

    git add Config.js
    
    git commit -m "Config - temporary"
    
    git push -f $1 master
    
    git reset --soft HEAD~1
    
    git reset HEAD Config.js
    
    git update-index --assume-unchanged Config.js
fi