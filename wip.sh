(http --print h localhost:4000/ | egrep '^HTTP|Date' && echo "✅ / 1 done") &
(http localhost:4000/users && echo "✅ /users 2 done") &
(http --print h localhost:4000/ | egrep '^HTTP|Date' && echo "✅ / 3 done") &

wait
echo "✅ All requests completed."
