import_code("/home/Bartek/sources/hack.src")
import_code("/home/Bartek/sources/connection.src")
import_code("/home/Bartek/sources/print.src")
import_code("/home/Bartek/sources/passwd.src")
import_code("/home/Bartek/sources/files.src")

usage = get_shell.host_computer.File(current_path + "/usage.txt").get_content
if not params then exit(usage)
command = params[0]
params = params[1:]

get_var = function(var)
	index = params.indexOf(var)
	if index != null and params.hasIndex(index+1) then return params[index+1]
end function

if command == "scan_lib" then
	path = get_var("--path")
	memory = get_var("--memory")
	save = params.indexOf("--save")
	if not path then exit(usage)
	hack = new Hack
	hack.scan_lib(path, memory)
	if save then hack.save
else if command == "passwd" then
	file = get_var("--file")
	user = get_var("--user")
	decode = get_var("--decode")
	passwd = new Passwd
	if file then
		passwd.load(file)
		passwd.hack(user)
	end if
	if decode then exit(passwd.decode(decode))
else if command == "exploit" then
	ip = get_var("--ip")
	port = get_var("--port")
	memory = get_var("--memory")
	var = get_var("--var")
	data = get_var("--data")
	shell = params.indexOf("--shell")
	if data then
		file = get_shell.host_computer.File(data)
		if not file then exit(usage)
		data = file.get_content
	end if
	if not ip or not port then exit(usage)
	if (memory or var) and (not memory or not var) then exit(usage)
	if not memory and not var and not data then exit(usage)
	hack = new Hack
	conn = new Connection
	conn.connect(ip, port)
	if memory and var then hack.exploit(conn, memory, var)
	if data then hack.bruteforce(conn, data)
	if shell and conn.shell then conn.terminal
end if
