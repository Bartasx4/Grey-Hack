import_code("/home/Bartek/other/connection.src")
import_code("/home/Bartek/other/commands.src")
import_code("/home/Bartek/other/hack.src")

Terminal = {}
Terminal.shell = get_shell
Terminal.connection = new Connection
Terminal.commands = new Commands
// ########## Main loop ##########
Terminal.start = function()
	input = ""
	while input != "exit"
		input = user_input(self.prompt)
		if input == "exit" then exit
		input = input.split(".")
		args = ""
		command = self.commands
		for input_ in input
			if input_.indexOf(" ") != null then
				args = input_.split(" ")[1:]
				input_ = input_.split(" ")[0]
			end if
			for name in command.__isa.indexes
				if input_ == name then
					command = command[name]
					break
				end if
			end for
			print(command)
		end for
	end while
end function
// ########## Prompt ##########
Terminal.prompt = function()
	return active_user + ":$ "
end function