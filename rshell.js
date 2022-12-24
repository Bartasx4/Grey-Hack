metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then metaxploit = include_lib(home_dir + "/metaxploit.so")
if not metaxploit then metaxploit = include_lib(current_path + "/metaxploit.so")
if metaxploit then print "metaxploit loaded" else exit "metaxploit.so not found"

ip = "123.98.175.230"
port = 1222
procName = "svhost"

metaxploit.rshell_client(ip, port, procName)
