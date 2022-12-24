Files = {
		"files": [],
		"search_in": ["/home/", "/lib/", "/var/", "/root/", "/etc/"]}
		
Files.check = function(file)
	if file then print("Loaded " + file.name) else return print(file + " not found.")
	if file.is_binary then return print(file.name + " is binary.")
	if not file.has_permission("r") then return print(file.path + " permission denied")
	return file
end function

Files.get_all = function(path="/")
	dir = get_shell.host_computer.File(path)
	if not dir.is_folder then return [dir]
	if dir.get_files then all_files = dir.get_files else all_files = []
	for item in dir.get_folders
		all_files = all_files + self.get_all(item.path)
	end for
	if path == "/" then self.files = all_files
	return all_files
end function

Files.print_all = function()
	if not self.files then self.files = self.get_all
	for file in self.files
		print(file.path)
	end for
end function

Files.save = function(path, content)
	
end function