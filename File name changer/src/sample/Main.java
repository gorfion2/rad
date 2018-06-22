package sample;

import java.io.File;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        System.out.println("Insert directory path");

        Scanner scanner = new Scanner(System.in);

        String path = scanner.nextLine();

        File filesDit = new File(path);

        if (!filesDit.exists() || !filesDit.isDirectory() || filesDit.listFiles() == null) {
            System.out.println("Invalid path");
            return;
        }

        List<File> fileList = Arrays.asList(filesDit.listFiles());
        fileList.sort(Comparator.comparingLong(File::lastModified));

        for (int i = 0; i < fileList.size(); i++) {
            File file = fileList.get(i);
            String index = "(" + i + ") ";
            File newFile = new File(file.getAbsolutePath().replace(file.getName(), index + file.getName()));
            boolean success = file.renameTo(newFile);
            if (!success) {
                System.out.println("Error during rename file: " + file.getName());
            }
        }

    }
}
