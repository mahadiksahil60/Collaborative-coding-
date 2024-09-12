import java.util.Scanner;

public class script {
    public static void main(String[] args) {
        // Create a Scanner object to read input
        Scanner scanner = new Scanner(System.in);
        
        // Prompt the user for their name
        System.out.print("Enter your name: ");
        
        // Read the input from the user
        String name = scanner.nextLine();
        
        // Print the input name
        System.out.println("Hello, " + name + "!");
        
        // Close the scanner
        scanner.close();
    }
}
