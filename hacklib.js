Hack = {}
Hack.last_scan = {}
Hack.metaxploit = null


Hack.scan_lib = function(lib, memory_list=null)
	if not self.metaxploit then self.metaxploit = self.load_metaxploit
	if typeof(lib) == "string" then
		file = get_shell.host_computer.File(lib)
		lib = self.metaxploit.load(file.path)
		if lib then print "Loaded " + lib.lib_name else exit "Lib """ + lib + """ not found."
	end if
	if not memory_list then memory_list = self.metaxploit.scan(lib)
	if typeof(memory_list) == "string" then memory_list = memory_list.split(",")
	print "Found memory: " + memory_list
	self.last_scan = {}
	for memory in memory_list
		self.last_scan[memory] = {}
		variable = null
		scan = self.metaxploit.scan_address(lib, memory)
		if not scan then continue
		for line in scan.split("\n")
			if line.indexOf("Unsafe check:") != null and line.indexOf("<b>") != null then
				variable = line[line.indexOf("<b>"):]
				variable = variable[:variable.indexOf(".")]
				variable = variable.replace("<b>", "").replace("</b>", "")
				if self.last_scan[memory].indexOf(variable) == null then self.last_scan[memory][variable] = []
			end if
			if line.indexOf("* ") != null then
				self.last_scan[memory][variable].push(line)
			end if
		end for
	end for
	self.last_scan = {lib.lib_name: {"version": lib.version, "data": self.last_scan}}
	return self.last_scan
end function

// memory:var,var,var;
Hack.bruteforce = function(connection, raw_data)
	data = {}
	for line in raw_data.split(";")
		memory = line.split(":")[0]
		vars = line.split(":")[1].split(",")
		data[memory] = vars
	end for
	print("Get data:")
	print(data)
	print("Starting bruteforce")
	for memory in data.indexes
		for var in data[memory]
			print("Checking [" + memory + ":" + var + "]")
			result = self.exploit(connection, memory, var)
			if typeof(result) == "shell" then
				if result.host_computer.File("/etc").has_permission("r") then return result
			else if typeof(result) == "file" then
				file = self._file(file)
				if file then return file
			else if typeof(result) == "computer" then
				file = result.File("/etc/passwd")
				file = self._file(file)
				if file then return file
			end if
		end for
	end for
end function


Hack.exploit = function(connection, memory, value, extraArgs="")
	lib = connection.session.dump_lib
	result = lib.overflow(memory, value, extraArgs)
	if not result then result = lib.overflow(memory, value, "password")
	if not result then return 
	print("Obtained """ + result + """.")
	if typeof(result) == "shell" then connection.shell = result else connection.shell = null
	if typeof(result) == "computer" then connection.computer = result else connection.computer = null
	return result
end function


Hack.load_metaxploit = function()
	metaxploit = include_lib("/lib/metaxploit.so")
	if not metaxploit then metaxploit = include_lib(home_dir + "/metaxploit.so")
	if not metaxploit then metaxploit = include_lib(current_path + "/metaxploit.so")
	if metaxploit then print "metaxploit loaded" else exit "metaxploit.so not found"
	return metaxploit
end function


Hack._computer = function(computer)
	return self.__file(computer.File("/etc/passwd"))
end function


Hack._file = function(file)
	print(file.path)
	files = new Files
	print(file.get_content)
	if files.check(file) then
		passwd = new Passwd
		passwd.load(file)
		users = passwd.hack()
		if not users then return
		print(users)
		return users
	end if
end function

Hack.scan_string = function()
	if self.last_scan.len == 0 then return print("last_scan is empty. Scan a lib first.")
	lib_name = self.last_scan.indexes[0]
	version = self.last_scan[lib_name]["version"]
	data = self.last_scan[lib_name]["data"]
	raw_data = ""
	for memory in data.indexes
		vars = data[memory]
		raw_vars = ""
		for v in vars.indexes
			if raw_vars.len > 0 then raw_vars = raw_vars + ","
			raw_vars = raw_vars + v
		end for
		if raw_data.len > 0 then raw_data = raw_data + ";"
		raw_data = raw_data + memory + ":" + raw_vars
	end for
	return raw_data
end function

Hack.save = function()
	raw_data = self.scan_string
	if not raw_data then return
	lib_name = self.last_scan.indexes[0]
	version = self.last_scan[lib_name]["version"]
	dir = get_shell.host_computer.File(home_dir + "/box/scans")
	if not dir then get_shell.host_computer.create_folder(home_dir + "/box", "scans")
	dir = get_shell.host_computer.File(home_dir + "/box/scans")
	if not dir then exit("Can't create folder scans in " + home_dir + "/box/")
	file_name = lib_name + version
	computer = get_shell.host_computer
	file = computer.File(dir.path + "/" + file_name)
	if not file then computer.touch(dir.path, file_name)
	file = computer.File(dir.path + "/" + file_name)
	file.set_content(raw_data)
end function


if program_path.split("/")[-1] == "hacklib"then
	import_code("/home/Bartek/box/sources/connection.src")
	import_code("/home/Bartek/box/sources/usage.src")
	import_code("/home/Bartek/box/sources/files.src")
	import_code("/home/Bartek/box/sources/print.src")
	usage = new Usage
	hack = new Hack
	conn = new Connection
	if params.len < 2 or params.len > 6 then exit(usage.hacklib)
	if params.indexOf("--scan") != null then
		lib_path = params[0]
		if params.indexOf("--save") then save = true else save = null
		if params.indexOf("--print") then print_ = true else print_ = null
		memory_index = params.indexOf("--memory")
		if memory_index != null and params.hasIndex(memory_index+1) then memory = params[memory_index + 1] else memory = null
		hack.scan_lib(lib_path, memory)
		if save then hack.save()
		if print_ then print_map(hack.last_scan)
		exit
	end if
	if params.indexOf("--shell") != null then
		shell = true
		params.remove(params.indexOf("--shell"))
	else
		shell = null
	end if
	if params.indexOf("--passwd") != null then
		passwd = true
		params.remove(params.indexOf("--passwd"))
	else
		passwd = null
	end if
	if params.len != 3 and params.len != 4 then exit(usage.hacklib)
	ip = params[0]
	port = params[1]
	conn.connect(ip, port)
	if params.len == 4 then
		memory = params[2]
		value = params[3]
		result = hack.exploit(conn, memory, value)
	else if params.len == 3 then
		scans_path = params[2]
		files = new Files
		raw_data = files.check(get_shell.host_computer.File(scans_path))
		if raw_data then
			raw_data = raw_data.get_content
			result = hack.bruteforce(conn, raw_data)
		end if
	end if
	if shell and conn.shell then conn.terminal
	if passwd then print ("Error: passwd not implemented.")
end if
