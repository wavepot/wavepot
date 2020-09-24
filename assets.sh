rm -rf backend/public/*

rollup -f es frontend/main.js >backend/public/main.js
rollup --silent -f es frontend/meta.js >backend/public/meta.js
rollup -f es frontend/dsp/src/mix-worker-thread.js >backend/public/mix-worker-thread.js
rollup -f es frontend/dsp/src/buffer-service.js >backend/public/buffer-service.js
rollup -f es frontend/editor/worker.js >backend/public/worker.js

cp frontend/components/OggVorbisEncoder.min.js.mem backend/public/
cp frontend/dynamic-cache-service-worker.js backend/public/
cp frontend/style.css backend/public/
cp frontend/index.html backend/public/
cp frontend/meta.html backend/public/
cp frontend/favicon.ico backend/public/
cp -R frontend/demos backend/public/
cp -R frontend/fonts backend/public/
