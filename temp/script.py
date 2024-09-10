import sys

# Check if a name was provided as a command-line argument
if len(sys.argv) > 1:
    name = sys.argv[1]
else:
    name = "World"  # Default value if no name is provided

# Print the name
print("Hello, " + name + "!")
