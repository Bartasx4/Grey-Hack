if params.len > 1 then exit("Usage: " + program_path.split("/")[-1] + " [dirname]")

source_path = home_dir + "/source"
if params.len == 1 then
	source_path = home_dir + "/" + params[0]
end if
source_name = home_dir + "/scripts.txt"

pc = get_shell.host_computer
source = pc.File(source_name)
if not source then
	exit("Error: File scripts.txt not found at " + home_dir)
end if

filenames = []
filecontents = []
source_content = source.get_content.split("@@@@@@" + char(10))

for sourcefile in source_content
	// Store filenames
	filename = sourcefile[sourcefile.indexOf("@@@@@")+5:sourcefile.indexOf(char(10))+1]
	if not filename then continue
	filename = filename.remove(char(10))
	filenames.push(filename)
	//print(filename)

	// Store file contents
	string = "@@@@@" + filename + char(10)
	contents = sourcefile[string.len:]
	if not contents then continue
	filecontents.push(contents)
	//print(contents)
end for

srcdir = pc.File(source_path)
if not srcdir then
	print("Source dir " + source_path + " doesn't exist, creating...")
	pc.create_folder(home_dir, source_path.split("/")[-1])
	srcdir = pc.File(source_path)
	if not srcdir then exit("Error: Couldn't create source directory.")
end if

// Write the source files.
for filename in filenames
	file = pc.File(srcdir.path + "/" + filename)
	if not file then
		print("Creating file '" + srcdir.path + "/" + filename + "'.")
		result = pc.touch(srcdir.path + "/", filename)
		if not result then print("Failed to create file '" + srcdir.path + "/" + filename + "'.")
		file = pc.File(srcdir.path + "/" + filename)
		if not file then continue
	end if
	content = filecontents.pull
	file.set_content(content)
	print("File '" + srcdir.path + "/" + filename + "' saved.")
end for

print("Done unzipping 'scripts.txt'.")