import json

from flask import Flask, request, Response
from flask_mysql_connector import MySQL
from flask_cors import CORS

app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE'] = 'ecom-v4'
mysql = MySQL(app)
CORS(app)

@app.route('/login', methods=["POST"])
def login():
    credentials = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM customer WHERE email = '%s'"%credentials['username'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res))
    if len(res)==1 and res[0].get('Password') == credentials['password']:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            response=json.dumps(dict(result = 'Login Unsuccessful')),
            status=403
        )

@app.route('/signup', methods=["POST"])
def signup():
    customerDetails = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM customer WHERE email = '%s'"%customerDetails['Email'])
    res = cur.fetchall()
    if len(res)>=1:
        return Response(
            response=json.dumps(dict(result = 'Email Already Exists')),
            status=403
        )
    else:
        cur.execute("INSERT INTO customer(Name, Address, Email, Mobile, Password) "
                    "values('%s','%s','%s','%s','%s')"
                    %(customerDetails['Name'],customerDetails['Address'],customerDetails['Email'],
                    customerDetails['Mobile'],customerDetails['Password']))
        cur.execute("INSERT IGNORE INTO region (address, region) VALUES('%s', '%s')"%(customerDetails['Address'], customerDetails['Region']))
        mysql.connection.commit()
        return Response(
            response=json.dumps(dict(result = 'Signup Successful')),
            status=200
        )

@app.route('/getCustomerOrders', methods=["POST"])
def getCustomerOrdersPlaced():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT O.*, R.Region FROM `ecom-v4`.order O JOIN Region R on O.ShippingAddress = R.Address \
                    WHERE customerId = '%s' ORDER BY OrderDate DESC"%reqJson['customerId'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/getOrderDetails', methods=["POST"])
def getOrderDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM OrderDetails WHERE OrderID = '%s'"%reqJson['OrderID'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/getBillingDetails', methods=["POST"])
def getBillingDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Billing B where OrderID = '%s'"%reqJson['OrderID'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            status=404
        )

@app.route('/getProductDetails', methods=["POST"])
def getProductDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Catalogue WHERE ProductID = '%s'"%reqJson['ProductID'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/getAllProducts', methods=["POST"])
def getAllProducts():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Catalogue")
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/searchProduct', methods=["POST"])
def searchProduct():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Catalogue WHERE ProductType like '%s' OR ProductName like '%s'"
                %('%'+reqJson['ProductType']+'%', '%'+reqJson['ProductType']+'%'))
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/getSellerDetails', methods=["POST"])
def getSellerDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT S.*, R.Region FROM Seller S JOIN Region R ON S.Seller_Address = R.Address WHERE ProductID = '%s'"%reqJson['ProductID'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/getCartDetails', methods=["POST"])
def getCartDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Cart WHERE CustomerID = '%s'"%reqJson['CustomerID'])
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/updateCartDetails', methods=["POST"])
def updateCartDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Cart(CustomerID, ProductID) values('%s', '%s')"%(reqJson['CustomerID'],
                                                                                     reqJson['ProductID']))
    mysql.connection.commit()
    if cur.rowcount==1:
        return Response(
            status=200
        )
    else:
        return Response(
            status=500
        )

@app.route('/fetchBestRegion', methods=["POST"])
def fetchBestRegion():
    cur = mysql.connection.cursor()
    cur.execute("CREATE OR REPLACE VIEW view1 as SELECT region, COUNT(*) AS totalOrders \
                FROM `ecom-v4`.Order O JOIN Region R ON O.ShippingAddress = R.Address\
                GROUP BY region")
    mysql.connection.commit()
    cur.execute("SELECT region, totalOrders FROM view1 HAVING totalOrders = (SELECT MAX(totalOrders) FROM view1)")
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default=str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/updateBillingDetails', methods=["POST"])
def updateBillingDetails():
    reqJson = request.get_json()
    print(reqJson)
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO `ecom-v4`.order(`CustomerID`, `OrderDate`, `return`, `ShippingAddress`) VALUES('%s','%s', '%s', '%s')"
                %(reqJson['CustomerID'],reqJson['OrderDate'], reqJson['Return'], reqJson['ShippingAddress']))
    mysql.connection.commit()
    if cur.rowcount == 1:
        orderID = cur.lastrowid
        print(orderID)
        cur.execute("INSERT INTO Billing(OrderID, PaymentMode) values('%s', '%s')"%(orderID, reqJson['PaymentMode']))
        rowCountBilling = cur.rowcount
        print(rowCountBilling)
        #mysql.connection.commit()
        cur.execute("INSERT IGNORE INTO region (address, region) VALUES('%s', '%s')"%(reqJson['ShippingAddress'], reqJson['Region']))
        productsOrdered = reqJson['Products']
        #Updating seller stocks and inserting new rows in the orderdetails table
        rowCountOrderDet = 0
        for products in productsOrdered:
            cur.execute("UPDATE Seller set `InstockQty` = `InstockQty`- %d WHERE ProductID = '%s'"%(int(products['OrderQty']), products['ProductID']))
            cur.execute("INSERT INTO OrderDetails(OrderID, ProductID, OrderQty) VALUES('%s', '%s','%s')"%(orderID, products['ProductID'], products['OrderQty']))
            rowCountOrderDet += cur.rowcount
            cur.execute("DELETE FROM Cart WHERE CustomerID = '%s' AND ProductID = '%s'"%(reqJson['CustomerID'], products['ProductID']))

        mysql.connection.commit()

        print('OrderDetails no.of new rows : ', rowCountOrderDet)
        if rowCountBilling >= 1 and rowCountOrderDet == len(productsOrdered):
            return Response(
                #response=json.dumps(res, default=str),
                status=200
            )
        else:
            return Response(
                status = 500
            )

    else:
        return Response(
            #response=json.dumps(res, default=str),
            status=404
        )

@app.route('/insertSellerDetails', methods=["POST"])
def insertSellerDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Seller(Seller_Name, Seller_Address, ProductID, InstockQty) values('%s', '%s', '%s', '%s')"
                           %(reqJson['SellerName'], reqJson['SellerAddress'], reqJson['ProductID'], reqJson['InstockQty']))
    cur.execute("INSERT IGNORE INTO region (address, region) VALUES('%s', '%s')"%(reqJson['SellerAddress'], reqJson['Region']))
    mysql.connection.commit()
    if cur.rowcount==1:
        return Response(
            status=200
        )
    else:
        return Response(
            status=500
        )

@app.route('/checkOrderQty', methods=["POST"])
def checkOrderQty():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT `InstockQty` from Seller where ProductID = '%s'"%reqJson['ProductID'])
    res = cur.fetchall()
    instockQty = res[0][0]
    if(instockQty - int(reqJson['OrderQty']) > 0):
        return Response(
            response = json.dumps(dict(result = 'In Stock')),
            status=200
        )
    else:
        return Response(
            response = json.dumps(dict(result = 'Out Of Stock')),
            status=500
        )

@app.route('/getSellerProfits', methods=["POST"])
def getSellerProfits():
    cur = mysql.connection.cursor()
    cur.execute("SELECT OD.ProductID, SellingPrice, CostPrice, sum(OrderQty) AS totalCount \
                 FROM `ecom-v4`.OrderDetails OD join `ecom-v4`.catalogue C on \
                 OD.ProductID = C.ProductID \
                 group by OD.ProductID")
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]

    result = {}
    for product in res:
        print(product['SellingPrice'] * product['totalCount'], product['CostPrice'] * product['totalCount'])
        profit = (product['SellingPrice'] * product['totalCount']) - (product['CostPrice'] * product['totalCount'])
        result[product['ProductID']] = profit if profit > 0 else 0

    result = {k: v for k, v in sorted(result.items(), key=lambda item: item[1], reverse = True)}
    return Response(
            response = json.dumps(result, default = str),
            status=200
        )

@app.route('/topProducts', methods=["POST"])
def topProducts():
    cur = mysql.connection.cursor()
    cur.execute("CREATE OR REPLACE VIEW v1 AS SELECT OD.ProductID , SUM(OrderQty) AS TotalQuantity, C.ProductName, C.SellingPrice \
                FROM OrderDetails OD JOIN Catalogue C ON OD.ProductID = C.ProductID \
                GROUP BY ProductID ORDER BY totalQuantity desc")
    mysql.connection.commit()
    cur.execute("SELECT * FROM v1 HAVING v1.totalQuantity IN (SELECT * FROM (SELECT DISTINCT totalQuantity FROM v1 LIMIT 3) AS t1)")
    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    return Response(
        response = json.dumps(res, default = str),
        status = 200
    )



@app.route('/insertProductDetails', methods=["POST"])
def insertProductDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO Catalogue(ProductID, ProductName, ProductType, CostPrice, SellingPrice, Color) \
                values('%s', '%s', '%s', '%s', '%s', '%s')"
                %(reqJson['ProductID'], reqJson['ProductName'], reqJson['ProductType'], reqJson['CostPrice'], reqJson['SellingPrice'], reqJson['Color']))
    mysql.connection.commit()
    if cur.rowcount==1:
        return Response(
            status=200
        )
    else:
        return Response(
            status=500
        )

@app.route('/deleteProductDetails', methods=["POST"])
def deleteProductDetails():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM Catalogue WHERE ProductID = '%s'"%reqJson['ProductID'])
    mysql.connection.commit()
    if cur.rowcount==1:
        return Response(
            status=200
        )
    else:
        return Response(
            status=500
        )

@app.route('/updateSellerDetails', methods=["POST"])
def updateSellerDetails():
    count = 0
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    for attribute, value in reqJson.items():
        if value != '' and attribute != "Seller_ID" and attribute != "Region":
            cur.execute("UPDATE Seller SET %s = '%s' WHERE Seller_ID = '%s' and %s != '%s'"%(attribute, value, reqJson['Seller_ID'], attribute, value))
            count = count + cur.rowcount
        if value != '' and attribute == "SellerAddress":
            cur.execute("UPDATE Region SET region = '%s' WHERE Address = '%s' and region != '%s'"
                        %(reqJson['Region'], reqJson['Seller_Address'], reqJson['Region']))
            count = count + cur.rowcount

        mysql.connection.commit()
    if count>=1:
        return Response(
            status=200
        )
    else:
        return Response(
            response = "Already updated!",
            status=500
        )

@app.route('/updateProductDetails', methods=["POST"])
def updateProductDetails():
    count = 0
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    for attribute, value in reqJson.items():
        if value != '' and attribute != "ProductID":
            cur.execute("UPDATE Catalogue SET %s = '%s' WHERE ProductID = '%s'"%(attribute, value, reqJson['ProductID']))
            count = count + cur.rowcount
    mysql.connection.commit()
    if count>=1:
        return Response(
            status=200
        )
    else:
        return Response(
            response = "Already updated!",
            status=500
        )

@app.route('/searchOrders', methods=["POST"])
def searchOrders():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("SELECT OD.OrderQty, OD.ProductID, O.*, C.Color, C.ProductType, C.ProductName \
                    FROM OrderDetails OD JOIN `ecom-v4`.order O on O.OrderID = OD.OrderID \
                    join (SELECT * FROM Catalogue WHERE ProductName LIKE '%s' OR ProductType LIKE '%s') as C \
                    WHERE O.CustomerID = '%s' and OD.ProductID = C.ProductID ORDER BY OrderDate DESC"
                %('%'+reqJson['SearchKey']+'%','%'+reqJson['SearchKey']+'%',reqJson['CustomerID']))

    res = [dict((cur.description[i][0], value)
                for i, value in enumerate(row)) for row in cur.fetchall()]
    print(json.dumps(res, default = str))
    if len(res)>=1:
        return Response(
            response=json.dumps(res, default=str),
            status=200
        )
    else:
        return Response(
            status=404
        )

@app.route('/updateCancelledOrder', methods=["POST"])
def updateCancelledOrder():
    reqJson = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("UPDATE `ecom-v4`.order set `Return` = 1 WHERE OrderID = '%s'"%(reqJson['OrderID']))
    mysql.connection.commit()
    if cur.rowcount==1:
        return Response(
            status=200
        )
    else:
        return Response(
            status=404
        )

app.run()