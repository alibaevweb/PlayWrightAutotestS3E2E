import {test, expect} from '@playwright/test'
import * as OTPAuth from "otpauth";

test('test' async ({page})) => {

    let totp = new OTPAuth.TOTP({
        issuer: "ACME",
        label: "AzureDiamond",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: "NB2W45DFOIZA", // or 'OTPAuth.Secret.fromBase32("NB2W45DFOIZA")'
  
    await page.goto('https://dev.sergek.kz/login');
    // Click [data-testid="identifier-field"]
    await page.locator('[data-testid="identifier-field"]').click();
    // Fill [data-testid="identifier-field"]
    await page.locator('[data-testid="identifier-field"]').fill('o.miras');
    // Click [data-testid="password-field"]
    await page.locator('[data-testid="password-field"]').click();

    // Fill [data-testid="password-field"]
    await page.locator('[data-testid="password-field"]').fill('Qwerty!!11');
    // Click [data-testid="submit-button"]
    await page.locator('[data-testid="submit-button"]').click();
    
    let token = totp.generate();

    // Validate a token.
    let delta = totp.validate({
      token: token,
      window: 1,
    });
    
    // Convert to Google Authenticator key URI:
    //   otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30
    let uri = totp.toString(); // or 'OTPAuth.URI.stringify(totp)'
    
    // Convert from Google Authenticator key URI.
    let parsedTotp = OTPAuth.URI.parse(uri);
  
    };
