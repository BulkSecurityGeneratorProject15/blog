/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AddressComponentsPage, AddressDeleteDialog, AddressUpdatePage } from './address.page-object';

const expect = chai.expect;

describe('Address e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let addressUpdatePage: AddressUpdatePage;
    let addressComponentsPage: AddressComponentsPage;
    let addressDeleteDialog: AddressDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Addresses', async () => {
        await navBarPage.goToEntity('address');
        addressComponentsPage = new AddressComponentsPage();
        await browser.wait(ec.visibilityOf(addressComponentsPage.title), 5000);
        expect(await addressComponentsPage.getTitle()).to.eq('blogApp.address.home.title');
    });

    it('should load create Address page', async () => {
        await addressComponentsPage.clickOnCreateButton();
        addressUpdatePage = new AddressUpdatePage();
        expect(await addressUpdatePage.getPageTitle()).to.eq('blogApp.address.home.createOrEditLabel');
        await addressUpdatePage.cancel();
    });

    it('should create and save Addresses', async () => {
        const nbButtonsBeforeCreate = await addressComponentsPage.countDeleteButtons();

        await addressComponentsPage.clickOnCreateButton();
        await promise.all([
            addressUpdatePage.setAddressInput('address'),
            addressUpdatePage.setStateInput('state'),
            addressUpdatePage.setZipcodeInput('zipcode')
        ]);
        expect(await addressUpdatePage.getAddressInput()).to.eq('address');
        expect(await addressUpdatePage.getStateInput()).to.eq('state');
        expect(await addressUpdatePage.getZipcodeInput()).to.eq('zipcode');
        await addressUpdatePage.save();
        expect(await addressUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Address', async () => {
        const nbButtonsBeforeDelete = await addressComponentsPage.countDeleteButtons();
        await addressComponentsPage.clickOnLastDeleteButton();

        addressDeleteDialog = new AddressDeleteDialog();
        expect(await addressDeleteDialog.getDialogTitle()).to.eq('blogApp.address.delete.question');
        await addressDeleteDialog.clickOnConfirmButton();

        expect(await addressComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
