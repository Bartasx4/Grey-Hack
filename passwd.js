Passwd = {}
Passwd.file = null
Passwd.users = {}
Passwd.crypto = null

Passwd.load_crypto = function()
	cryptools = include_lib("/lib/crypto.so")
	if not cryptools then cryptools = include_lib(current_path + "/crypto.so")
	if not cryptools then cryptools = include_lib(home_dir + "/crypto.so")
	if not cryptools then cryptools = include_lib(home_dir + "/box/crypto.so")
	if not cryptools then cryptools = include_lib(home_dir + "/box/lib/crypto.so")
	if cryptools then print("Loaded crypto.so.") else print("Can't load crypto.so")
	self.crypto = cryptools
	return cryptools
end function

Passwd.load = function(file)
	if not file then return print("Need a file or path to file.")
	if typeof(file) == "string" then file = get_shell.host_computer.File(file)
	if not file then return print("File not found.")
	if file.is_binary then return print("File is binary.")
	if not file.has_permission("r") then return print("Can't open file " + file.path + ". Permission danied.")
	content = file.get_content
	if content.len == 0 then return print("File is empty.")
	self.file = file
end function
	
Passwd.hack = function(decode_user=null)
	self.crypto = self.load_crypto
	if not self.file then return print("Load passwd file first.")
	content = self.file.get_content.split("\n")
	all_users = {}
	for line in content
		user_and_password = line.split(":")
		if user_and_password.len != 2 then continue
		all_users[user_and_password[0]] = user_and_password[1]
	end for
	if all_users.len == 0 then return print("Not found any user.")
	print("Found users: " + all_users.indexes)
	for user in all_users.indexes
		if (decode_user and decode_user == user) or (not decode_user) then
			print("Decript: " + user)
			self.users[user] = self.crypto.decipher(all_users[user])
			print("Found password: """ + self.users[user] + """.")
		end if
	end for
	print("")
	if self.users.len > 0 then
		for user in self.users.indexes
			print(user + " => " + self.users[user])
		end for
	end if
	if self.users then return self.users else return null
end function

Passwd.decode = function(code)
	if not self.crypto then self.crypto = self.load_crypto
	pass = code
	user = null
	if code.split(":").len == 2 then
		user = code.split(":")[0]
		pass = code.split(":")[1]
	end if
	result = self.crypto.decipher(pass)
	if user then
		print(user + " => " + result)
		result = user + ":" + result
	else
		print(pass + " => " + result)
	end if
	return result
end function


if program_path.split("/")[-1] == "passwd"then
	import_code("/home/Bartek/sources/files.src")
	import_code("/home/Bartek/sources/usage.src")
	usage = new Usage
	passwd = new Passwd
	if params.len != 1 and params.len != 2 and params.len != 3 then exit(usage.passwd)
	if params[0] == "-d" and params.len == 2 then
		code = params[1]
		passwd.decode(code)
	else if params.len == 1 or params.len == 3 then
		user = null
		file_path = params[0]
		if params.len == 3 and params[1] == "-u" then user = params[2]
		passwd.load(file_path)
		passwd.hack(user)
	else
		exit(usage.passwd)
	end if
end if