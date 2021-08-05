const ProductFixture = require('../service/administration/fixture/product.fixture');
const CustomerFixture = require('../service/administration/fixture/customer.fixture');
const CategoryFixture = require('../service/administration/fixture/category.fixture');
const ShippingFixture = require('../service/administration/fixture/shipping.fixture');
const PaymentMethodFixture = require('../service/administration/fixture/payment-method.fixture');
const NewsletterRecipientFixture = require('../service/administration/fixture/newsletter-recipient.fixture');
const CmsFixture = require('../service/administration/fixture/cms.fixture');
const OrderFixture = require('../service/saleschannel/fixture/order.fixture');
const OrderAdminFixture = require('../service/administration/fixture/order.fixture');
const AdminSalesChannelFixture= require('../service/administration/fixture/sales-channel.fixture');
const Fixture = require('../service/administration/fixture.service');

/**
 * Create entity using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createDefaultFixture
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning deletion
 */
Cypress.Commands.add('createDefaultFixture', (endpoint, data = {}, jsonPath) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new Fixture(authInformation);
        let finalRawData = {};

        if (!jsonPath) {
            jsonPath = endpoint;
        }

        return cy.fixture(jsonPath).then((json) => {
            finalRawData = Cypress._.merge(json, data);

            return fixture.create(endpoint, finalRawData);
        });
    });
});

/**
 * Create product fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createProductFixture
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createProductFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new ProductFixture(authInformation);

        return cy.fixture('product').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setProductFixture(data);
        });
    });
});

/**
 * Create category fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createCategoryFixture
 * @function
 * @param {object} [userData={}] - Additional category data
 */
Cypress.Commands.add('createCategoryFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new CategoryFixture(authInformation);

        return cy.fixture('category').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setCategoryFixture(data);
        });
    });
});

/**
 * Create sales channel fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createSalesChannelFixture
 * @function
 * @param {String} endpoint - API endpoint for the request
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createSalesChannelFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new AdminSalesChannelFixture(authInformation);

        return cy.fixture('product').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setSalesChannelFixture(data);
        });
    });
});

/**
 * Create sales channel domain using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name setSalesChannelDomain
 * @function
 * @param {String} [salesChannelName=Storefront] - Options concerning creation
 */
Cypress.Commands.add('setSalesChannelDomain', (salesChannelName = 'Storefront') => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new AdminSalesChannelFixture(authInformation);
        return fixture.setSalesChannelDomain(salesChannelName)
    });
});

/**
 * Create customer fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createCustomerFixture
 * @function
 * @param {Object} [userData={}] - Options concerning creation
 */
Cypress.Commands.add('createCustomerFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new CustomerFixture(authInformation);
        let customerJson = null;

        return cy.fixture('customer').then((result) => {
            customerJson = Cypress._.merge(result, userData);
            return cy.fixture('customer-address');
        }).then((data) => {
            return fixture.setCustomerFixture(customerJson, data);
        });
    });
});

/**
 * Create cms fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createCmsFixture
 * @function
 * @param {Object} [userData={}] - Options concerning creation
 */
Cypress.Commands.add('createCmsFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new CmsFixture(authInformation);
        let pageJson = null;

        return cy.fixture('cms-page').then((data) => {
            pageJson = data;
            return cy.fixture('cms-section')
        }).then((data) => {
            return Cypress._.merge(pageJson, {
                sections: [data]
            });
        }).then((data) => {
            return fixture.setCmsPageFixture(data);
        });
    });
});

/**
 * Create property fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createPropertyFixture
 * @function
 * @param {Object} [options={}] - Options concerning creation
 * @param {Object} [userData={}] - Options concerning creation
 */
Cypress.Commands.add('createPropertyFixture', (options, userData) => {
    return cy.authenticate().then((authInformation) => {
        let json = {};
        const fixture = new Fixture(authInformation);

        return cy.fixture('property-group').then((result) => {
            json = Cypress._.merge(result, options);
        }).then(() => {
            return Cypress._.merge(json, userData);
        }).then((result) => {
            return fixture.create('property-group', result);
        });
    });
});

/**
 * Create language fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createLanguageFixture
 * @function
 */
Cypress.Commands.add('createLanguageFixture', () => {
    return cy.authenticate().then((authInformation) => {
        let json = {};
        const fixture = new Fixture(authInformation);

        return cy.fixture('language').then((result) => {
            json = result;

            return fixture.search('locale', {
                field: 'code',
                type: 'equals',
                value: 'en-PH'
            });
        }).then((result) => {
            return {
                name: json.name,
                localeId: result.id,
                parentId: json.parentId
            };
        }).then((result) => {
            return fixture.create('language', result);
        });
    });
});

/**
 * Create shipping fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createShippingFixture
 * @function
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createShippingFixture', (userData) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new ShippingFixture(authInformation);

        return cy.fixture('shipping-method').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setShippingFixture(data);
        });
    });
});

/**
 * Create payment method fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createPaymentMethodFixture
 * @function
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createPaymentMethodFixture', (userData) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new PaymentMethodFixture(authInformation);

        return cy.fixture('payment-method').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setPaymentMethodFixture(data);
        });
    });
});

/**
 * Create newsletter recipient fixture
 * @memberOf Cypress.Chainable#
 * @name createNewsletterRecipientFixture
 * @function
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createNewsletterRecipientFixture', (recipient) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new NewsletterRecipientFixture(authInformation);

        return cy.fixture('customer').then((result) => {
            return Cypress._.merge(result, recipient);
        }).then((recipientData) => {
            return fixture.setNewsletterRecipientFixture(recipientData);
        });
    });
});

/**
 * Create snippet fixture using Shopware API at the given endpoint
 * @memberOf Cypress.Chainable#
 * @name createSnippetFixture
 * @function
 * @param {Object} [options={}] - Options concerning creation
 */
Cypress.Commands.add('createSnippetFixture', () => {
    return cy.authenticate().then((authInformation) => {
        let json = {};
        const fixture = new Fixture(authInformation);

        const findLanguageId = () => fixture.search('language', {
            type: 'equals',
            value: 'English'
        });
        const findSetId = () => fixture.search('snippet-set', {
            type: 'equals',
            value: 'BASE en-GB'
        });

        return cy.fixture('snippet')
            .then((result) => {
                json = result;

                return Promise.all([
                    findLanguageId(),
                    findSetId()
                ])
            })
            .then(([language, set]) => {
                return Cypress._.merge(json, {
                    languageId: language.id,
                    setId: set.id
                });
            })
            .then((result) => {
                return fixture.create('snippet', result);
            });
    });
});

/**
 * Create order fixture (as logged-in customer)
 * @memberOf Cypress.Chainable#
 * @name createOrder
 * @function
 * @param {String} productId - ID of the product to be added to the order
 * @param {Object} customer - Options concerning customer
 */
Cypress.Commands.add('createOrder', (productId, customer) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new OrderFixture(authInformation);

        return fixture.createOrder(productId, customer);
    });
});

/**
 * Create guest order fixture
 * @memberOf Cypress.Chainable#
 * @name createGuestOrder
 * @function
 * @param {String} productId - Options concerning creation
 * @param {Object} [userData={}] - Options concerning creation
 */
Cypress.Commands.add('createGuestOrder', (productId, userData) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new OrderFixture(authInformation);

        return cy.fixture('storefront-customer').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.createGuestOrder(productId, data);
        });
    });
});

/**
 * Create guest order fixture via admin api
 * @memberOf Cypress.Chainable#
 * @name createAdminOrder
 * @function
 * @param {Object} userData - Data proved for this order to be created
 */
Cypress.Commands.add('createAdminOrder', (userData) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new OrderAdminFixture(authInformation);

        return cy.fixture('order').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setOrderFixture(data);
        });
    });
});

/**
 * Create promotion fixture
 * @memberOf Cypress.Chainable#
 * @name createPromotionFixture
 * @function
 * @param {Object} [userData={}] - Options concerning creation
 */
Cypress.Commands.add('createPromotionFixture', (userData = {}) => {
    return cy.authenticate().then((authInformation) => {
        const fixture = new OrderFixture(authInformation);
        let promotionId = '';

        return cy.fixture('promotion').then((result) => {
            return Cypress._.merge(result, userData);
        }).then((data) => {
            return fixture.setPromotionFixture(data);
        }).then((data) => {
            promotionId = data.id;
            return cy.fixture('discount');
        }).then((result) => {
            return fixture.setDiscountFixture(result, promotionId);
        });
    });
});

/**
 * Sets Shopware back to its initial state
 * @memberOf Cypress.Chainable#
 * @name setToInitialState
 * @function
 */
Cypress.Commands.add('setToInitialState', () => {
    return cy.log('Cleaning, please wait a little bit.').then(() => {
        return cy.cleanUpPreviousState();
    }).then(() => {
        return cy.clearCacheAdminApi('DELETE', 'api/_action/cache');
    }).then(() => {
        return cy.setLocaleToEnGb();
    });
});

/**
 * Sets category and visibility for a product in order to set it visible in the Storefront
 * @memberOf Cypress.Chainable#
 * @name setProductFixtureVisibility
 * @function
 */
Cypress.Commands.add('setProductFixtureVisibility', (productName, categoryName) => {
    let salesChannelId = '';
    let productId = '';

    return cy.searchViaAdminApi({
        endpoint: 'sales-channel',
        data: {
            field: 'name',
            value: 'Storefront'
        }
    }).then((result) => {
        salesChannelId = result.id;

        return cy.searchViaAdminApi({
            endpoint: 'product',
            data: {
                field: 'name',
                value: productName
            }
        });
    }).then((result) => {
        productId = result.id;

        return cy.updateViaAdminApi('product', productId, {
            data: {
                visibilities: [{
                    visibility: 30,
                    salesChannelId: salesChannelId,
                }]
            }
        });
    }).then(() => {
        return cy.searchViaAdminApi({
            endpoint: 'category',
            data: {
                field: 'name',
                value: categoryName
            }
        });
    }).then((result) => {
        return cy.updateViaAdminApi('product', productId, {
            data: {
                categories: [{
                    id: result.id
                }]
            }
        });
    });
});
