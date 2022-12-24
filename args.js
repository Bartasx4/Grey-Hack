// passwd [file_path] [-u user] | [-d code]
// scan_lib [lib_path] [-m memory_list] [--save]*
// exploit [ip] [port] [memory] [value] [--shell] | [ip] [port] [raw_data] [--shell] | [ip] [port] [scans_path] [--shell]
// exploit 192.168.1.1 22 memory value --shell
Args = {"usage": null, "args": null}
Args.set = function(usage, args)
	possibilities = usage.split("|")
end function

get_options = function(text)
	
end function