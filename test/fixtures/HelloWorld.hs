import Haste.Foreign(ffi)

main::IO()
main = test "Hello World";

test::String->IO()
test = ffi "(function(s) {console.log(s);})"