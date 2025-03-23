from app import create_app


app = create_app()
if __name__ == "__main__":
        # Port 5001, in case your homepod is running
        app.run(debug=True, port=5001, host="0.0.0.0")

