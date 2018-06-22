package sample;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.FileChooser;

import java.io.*;
import java.util.ArrayList;

public class Controller {

    @FXML
    private TextField number;

    @FXML
    private Button importBtn;

    @FXML
    private Button validateBtn;

    @FXML
    private TableView<CreditCard> table;

    @FXML
    private Label info;

    @FXML
    private TableColumn<CreditCard, String> numberColumn;

    private RegexCardValidator cardValidator = new RegexCardValidator();
    private ObservableList<CreditCard> items;

    @FXML
    void initialize() {
        items = FXCollections.observableList(new ArrayList<>());
        table.setItems(items);

        numberColumn.setCellValueFactory(
                new PropertyValueFactory<>("number"));

    }

    @FXML
    void validateFromText() {
        String cardNumber = number.getText();

        CreditCard creditCard = new CreditCard(cardNumber);
        boolean valid = cardValidator.isValid(creditCard);
        if (valid) {
            info.setText("Number is valid");
            items.add(creditCard);
        } else {
            info.setText("Wrong number");
        }
    }

    @FXML
    void importFromFile() {
        FileChooser fileChooser = new FileChooser();
        FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("TXT files (*.txt)", "*.txt");
        fileChooser.getExtensionFilters().add(extFilter);


        File file = fileChooser.showOpenDialog(Main.getPrimaryStage());
        if (file != null && file.exists()) {
            try (FileReader fr = new FileReader(file); BufferedReader br = new BufferedReader(fr)) {
                String cardNumber;

                while ((cardNumber = br.readLine()) != null) {
                    CreditCard creditCard = new CreditCard(cardNumber);
                    boolean valid = cardValidator.isValid(creditCard);
                    if (valid) {
                        items.add(creditCard);
                    }
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
