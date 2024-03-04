Create table user(
    userID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName varchar(50)  NULL DEFAULT NULL,
    lastName varchar(50) NULL DEFAULT NULL,
    username varchar(15) UNIQUE NOT NULL ,
    email varchar(255) UNIQUE NOT NULL,
    passwordHash varchar(20) NOT NULL,
    phoneNumber varchar(15) NULL DEFAULT NULL,
    registeredAt datetime NOT NULL,   
    profile TEXT NULL DEFAULT NULL
	
);


 CREATE TABLE product (
  productID BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title varchar(255) UNIQUE NOT NULL,
  slug varchar(255) NOT NULL, 
  summary varchar(255) NULL,
  image varchar(225) NOT NULL, 
  brand varchar(255) NOT NULL, 
  publishedAt DATETIME NULL DEFAULT NULL,
  description varchar(255) NOT NULL, 
  price int (255) NOT NULL DEFAULT 0, 
  rating int (255) NOT NULL, 
  reviewCount int (255) DEFAULT 0 NOT NULL, 
  count int DEFAULT 0 NOT NULL, 
  category_id int,
  employee_id INT NOT NULL,
  sale_id int,
  SKU int (255) NOT NULL,
  constraint check (5 >= rating >= 1),
  createdAt DATE,
  FOREIGN KEY(employee_id) REFERENCES employee(employeeID),
  FOREIGN KEY(sale_id) REFERENCES sale(saleID),
  FOREIGN KEY(category_id) REFERENCES category(categoryID)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION)
  ;



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


create table managers (
        managerID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        firstName varchar(15)  NOT NULL,
        lastName varchar(15)  NOT NULL

);

CREATE TABLE category (
  categoryID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(15) NOT NULL UNIQUE,
  description varchar(255),
  managerSsn varchar(15),
  FOREIGN KEY (managerSsn) REFERENCES employee(ssn)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
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
CREATE TABLE orders (
    orderID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id bigint,
    total float NOT NULL,
    discount int,
    paymentMethod_id int,
    orderDate datetime,
    tax float,
    FOREIGN KEY (paymentMethod_id) REFERENCES paymentMethod(paymentMethodID),
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
    shippingID varchar(10),
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




INSERT INTO users (username, firstName, lastname, email, password, )
VALUES('blackflame', 'chiemela', 'umeh', 'engineerfranklyn', 'pass',)

INSERT INTO products (title, slug, image, brand, description, price, rating, count, reviewCount, categoryID, userID )
VALUES  ('shasta-pic', 'pink-dispenser', 'https://www.mascots.com/wp-content/uploads/2019/07/uhmascots1-1-931x1024.png', 
'Homicool', 'HIGH QUALITY DURABLE MATERIAL', 36, 3, 60, 7, 1, 1);

  


INSERT INTO categories (name)
VALUES("category1")


