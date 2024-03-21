

Create table productReview(
	productReviewID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id bigint,
    product_id bigint,
    title varchar(100) NOT NULL,
    createdAt DATETIME NOT NULL,
    content TEXT NOT NULL,
	CONSTRAINT FOREIGN Key(user_id) references user(userID),
    FOREIGN Key(product_id) references product(productID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


CREATE TABLE employee (
  employeeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(15) NOT NULL,
  ssn varchar(15) UNIQUE NOT NULL, -- Add UNIQUE constraint here
  lastName varchar(15) NOT NULL,
  badgeNumber varchar(15) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  phoneNumber int(15),
  dateOfHire datetime NOT NULL,
  myManagerID int UNIQUE,
  FOREIGN KEY (myManagerID) REFERENCES managers(managerID)
);





Create table address(
    addressID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    streetNumber varchar(7) NOT NULL,
    streetName	varchar(50) NOT NULL,
    city varchar(50) NOT NULL,
    state smallint(2) NOT NULL,
    zipCode	smallint(5) NOT NULL,
    user_id bigint,
    FOREIGN KEY(user_id) REFERENCES user(userID)

);

CREATE TABLE paymentMethod (
    paymentMethodID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(15) NOT NULL,
    user_id bigint,
    FOREIGN KEY (user_id) REFERENCES user(userID)
);

create table transaction (
    transactionID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    paymentMethod_id int NOT NULL,
    user_id bigint,
    authorized BOOLEAN NOT NULL,
    status varchar(15),
    createdAt datetime NOT NULL,
    FOREIGN KEY (paymentMethod_id) REFERENCES paymentMethod(paymentMethodID),
	FOREIGN KEY(user_id) REFERENCES user(userID)


	

);
CREATE TABLE orderItem (
    orderItemID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    orders_id INT NULL,
    price FLOAT NOT NULL DEFAULT 0,
    sku varchar(100) NOT NULL,
    discount FLOAT NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    quantity SMALLINT DEFAULT 1 CHECK (quantity >= 0),
    FOREIGN KEY (orders_id) REFERENCES orders(orderID),
    FOREIGN KEY (product_id) REFERENCES product(productID)
);



Create table shipping(
    shippingID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id int, 
    user_id bigint,
    streetNumber varchar(7) NOT NULL,
   streetName	varchar(50) NOT NULL,
     city varchar(50) NOT NULL,
     state smallint(2) NOT NULL,
    zipCode	smallint(5) NOT NULL,
    Foreign Key(user_id) references user(userID),
    Foreign Key(order_id) references orders(orderID)
);


Create table cart(
    cartID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL DEFAULT NULL,
    sessionID VARCHAR (100) NOT NULL,
    isEmpty BOOLEAN NOT NULL,
    firstName varchar(50)  NULL DEFAULT NULL,
    lastName varchar(50) NULL DEFAULT NULL,
    mobile VARCHAR(15) NULL,
    total BIGINT NOT NULL,
    createdAt DATETIME NOT NULL,

    Foreign Key(user_id) references user(userID)
    
); 



CREATE TABLE cartItem (
    cartItemID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    productID BIGINT NOTNULL,
    cartID BIGINT NOTNULL,
    price FLOAT NOT NULL DEFAULT 0,
    sku varchar(100) NOTNULL,
    discount FLOAT NOT NULL DEFAULT 0,
    quantity SMALLINT DEFAULT 1 CHECK (quantity >= 0),
    FOREIGN KEY (cartID) REFERENCES cart(cartID),
    FOREIGN KEY (productID) REFERENCES products(productID)
);




CREATE TABLE supplier (
    supplierID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    companyName varchar(255) UNIQUE NOT NULL,
    category_id int,
    product_id bigint,
    nextSupply datetime,
    lastSupply datetime NOT NULL,
    quantity INT DEFAULT 1 CHECK (quantity >= 0),
    FOREIGN KEY (category_id) REFERENCES category(categoryID),
    FOREIGN KEY (product_id) REFERENCES product(productID)
);



create Table sale (
    saleID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) UNIQUE NOT NULL,
    percentDiscount int NOT NULL,
    endDate datetime NOT NULL,




)

