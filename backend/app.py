from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
import os

app = Flask(__name__)
CORS(app)

# SQL Server connection details (use environment variables for security)
SQL_SERVER = os.getenv('SQL_SERVER', 'localhost')
SQL_DATABASE = os.getenv('SQL_DATABASE', 'ExpenseApp')
SQL_USERNAME = os.getenv('SQL_USERNAME', 'your_username')
SQL_PASSWORD = os.getenv('SQL_PASSWORD', 'your_password')

CONN_STR = (
    f'DRIVER={{ODBC Driver 17 for SQL Server}};'
    f'SERVER={SQL_SERVER};'
    f'DATABASE={SQL_DATABASE};'
    f'UID={SQL_USERNAME};'
    f'PWD={SQL_PASSWORD}'
)

def get_db_connection():
    return pyodbc.connect(CONN_STR)

@app.route('/api/claims', methods=['POST'])
def create_claim():
    data = request.json
    claim = data.get('claim', {})
    bills = data.get('bills', [])

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert claim
    cursor.execute('''
        INSERT INTO [zeus_t1].[Claims] (
            claim_no, claim_title, claim_description, emp_id, no_of_bills, total_claim_amount, claim_status, claim_submitted_date, created_by, created_on
        ) VALUES (?, ?, ?, ?, ?, ?, ?, GETDATE(), ?, GETDATE())
    ''',
        claim['claimNo'],
        claim['claimTitle'],
        claim.get('claimDescription', ''),
        claim['empId'],
        len(bills),
        claim['totalClaimAmount'],
        claim.get('claimStatus', 'Drafted'),
        claim['createdBy']
    )
    # Get inserted claim_no (assume claim_no is unique and provided)

    # Insert bills
    for bill in bills:
        cursor.execute('''
            INSERT INTO [zeus_t1].[Bills] (
                bill_no, claim_no, expense_type_id, expense_sub_type_id, from_date, to_date, bill_amount, vat_amount, bill_remarks, no_of_attachments, merchant_name, invoice_number, is_company_car, vehicle_no, is_reduced_rate, fuel_type, km_travelled, engine_cc, claim_status, travel_class, is_deleted, created_by, created_on
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, GETDATE())
        ''',
            bill['billNo'],
            claim['claimNo'],
            bill.get('expenseTypeId'),
            bill.get('expenseSubTypeId'),
            bill.get('fromDate'),
            bill.get('toDate'),
            bill.get('billAmount'),
            bill.get('vatAmount'),
            bill.get('billRemarks'),
            bill.get('noOfAttachments', 0),
            bill.get('merchantName'),
            bill.get('invoiceNumber'),
            bill.get('isCompanyCar', 0),
            bill.get('vehicleNo'),
            bill.get('isReducedRate', 0),
            bill.get('fuelType'),
            bill.get('kmTravelled'),
            bill.get('engineCC'),
            bill.get('claimStatus', 'Drafted'),
            bill.get('travelClass'),
            bill.get('createdBy')
        )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Claim and bills created'}), 201

# You can add GET endpoints for claims/bills as needed

if __name__ == '__main__':
    app.run(debug=True)
