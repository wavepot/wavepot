# merge remote changes
git submodule update --remote --merge --recursive

# TODO: build

# update backend
cd backend
git add .
git commit -m "update build"
cd ..

# push local changes
git submodule foreach --recursive git push origin master
git add .
git commit -m "update submodules"
git push origin master
