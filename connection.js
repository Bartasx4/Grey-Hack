Connection = {}
Connection.shell = null
Connection.computer = null
Connection.metaxploit = include_lib("/lib/metaxploit.so")
Connection.port = null
Connection.session = null
Connection.login = function(address, port, user, password)
	self.shell = get_shell.connect_service(address, port.to_int, user, password)
	if self.shell then print("Connected to " + address + ":" + port + ".") else print("Connect failed to " + address + ":" + port + ".")
	if self.shell then self.port = port.to_int else self.port = null
	return self.shell
end function
Connection.connect = function(address, port)
	self.session = self.metaxploit.net_use(address, port.to_int)
	if self.session then print("Connected to " + address + ":" + port + ".") else return print("Connect failed to " + address + ":" + port + ".")
	if self.session then self.port = port.to_int else self.port = null
	return self.session
end function
Connection.send = function(source, destination, from_shell, to_shell)
	if self.port == 22 then send = from_shell.scp(source, destination, to_shell)
	if self.port == 21 then send = from_shell.put(source, destination, to_shell)
	return send
end function
Connection.terminal = function()
	if self.shell then self.shell.start_terminal else return print("You need access to shell.")
end function