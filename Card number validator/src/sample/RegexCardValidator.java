package sample;

/**
 * Created by Kamil on 2018-06-04.
 */
public class RegexCardValidator {

    public boolean isValid(final CreditCard creditCard) {
        String number = creditCard.getNumber().replaceAll("[^0-9]+", "");
        if ((number == null) || (number.length() < 13) || (number.length() > 19)) {
            return false;
        }

        return luhnCheck(number);
    }

    protected boolean luhnCheck(String cardNumber) {
        int digits = cardNumber.length();
        int oddOrEven = digits & 1;
        long sum = 0;
        for (int count = 0; count < digits; count++) {
            int digit = 0;
            try {
                digit = Integer.parseInt(cardNumber.charAt(count) + "");
            } catch (NumberFormatException e) {
                return false;
            }

            if (((count & 1) ^ oddOrEven) == 0) { // not
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }

        return sum != 0 && (sum % 10 == 0);
    }
}