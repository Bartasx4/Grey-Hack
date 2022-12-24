print_list = function(text, prefix="")
	if typeof(text) == "map" then
		print_map(text, prefix)
		return
	else if typeof(text) == "list" then
		for line in text
			if typeof(line) == "list" then
				print_list(line, prefix+"  ")
				print("")
			else if typeof(line) == "map" then
				print_map(line, prefix+"  ")
				print("")
			else
				print(prefix + line)
			end if
		end for
	else
		print(prefix + "  " + text)
	end if
end function		

print_map = function(text, prefix="")
	if typeof(text) == "list" then
		print_list(text, prefix)
		return
	else if typeof(text) == "map" then
		for key in text.indexes
			value = text[key]
			print(prefix + key + ":")
			if typeof(value) == "map" then
				print_map(value, prefix + "  ")
				print("")
			else if typeof(value) == "list" then
				print_list(value, prefix + "  ")
				print("")
			else
				print(prefix + "  " + value)
			end if
		end for
	else
		print(prefix + text)
	end if
end function