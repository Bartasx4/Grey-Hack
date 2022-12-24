Usage = {}
Usage.main = function()
	print "Commands"
	print "  scan_lib"
	print "    --path <path> - path to lib."
	print "    --memory <memory,memory,..,n> | optional - set memory to scan."
	print "    --save - save result to file."
	print "  exploit"
	print "    --ip <ip> - ip address of target."
	print "    --port <port> - port to connect to."
	print "    --memory <memory> --var <var> | optional - exploit specific memory and var."
	print "	   --data_file <path> | optional - path to file with data for bruteforce."
	print "	   --shell | optional - open shell if success"
	print "	   --passwd | optional - decode passwords if success"
	print "  passwd"
	print "    --file <path> | optional - path to passwd file."
	print "	--user <name> | optional - hack only this user password. Otherwice hack all."
	print "    --decode <password> | optional - decode password from string."
end function
	
Usage.passwd = function()
	print "<b>passwd [[filePath] [-u userName]] | [-d code]</b>"
	print "<b>-u userName </b>- User name to decode. Only if decoding file."
	print "<b>-d code </b>- Code to decode. Can be in format user:password or just password"
end function

Usage.hacklib = function()
	print "<b>hacklib [[ip] [port] [[memory] [value] | [scans_path]] [--shell] [--passwd]] | [lib_path] [--scan] [--memory memory1,memory2,...n] [--save] [--print] </b>"
	print "<b>ip</b> - ip address will connect to."
	print "<b>port</b> - port. 22 = ssh, 21 = ftp."
	print "<b>memory</b> - set memory address to exploit. Required if not bruteforce or missing scans."
	print "<b>value</b> - variable that will overflow. Required if not bruteforce or missing scans."
	print "<b>scans_path</b> - path folder with scans for <b>bruteforce</b>. Required to bruteforce. Otherwice set memory and value "
	print "<b>--shell</b> - open terminal if get targets shell."
	print "<b>--passwd</b> - try to get passwords if shell or computer obtained."
	print "<b></b>"
	print "<b></b>"
	print "<b></b>"
end function

