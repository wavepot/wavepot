# push local changes
git submodule foreach --recursive git push origin master
git add .
git commit -m "update submodules"
git push origin master
