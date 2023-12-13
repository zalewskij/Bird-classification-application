import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class TestFindButton(unittest.TestCase):
    def setUp(self):
        self.URL = "http://localhost:5173/"
        chrome_options = webdriver.ChromeOptions()
        prefs = {
            "profile.default_content_setting_values.media_stream_mic": 1,
        }
        chrome_options.add_experimental_option("prefs", prefs)
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(5)
        self.driver.get(self.URL)

    def test_check_recording(self):
        record_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'record')]"))
        )
        record_button.click()
        time.sleep(5)

        stop_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'Stop')]"))
        )
        stop_button.click()

        text_after_click = (
            WebDriverWait(self.driver, 10)
            .until(
                EC.visibility_of_element_located(
                    (By.XPATH, f"//*[contains(text(), 'To analyze the recording')]")
                )
            )
            .text
        )

        self.assertEqual(
            text_after_click,
            "To analyze the recording, select the relevant fragment using the slider below the spectrogram.",
        )
        WebDriverWait(self.driver, 10).until(
            EC.url_to_be(f"{self.URL}choosing_fragment")
        )

        analyze_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'Analyze')]"))
        )
        time.sleep(5)
        analyze_button.click()

        WebDriverWait(self.driver, 10).until(EC.url_to_be(f"{self.URL}results"))

        text_after_classification = (
            WebDriverWait(self.driver, 10)
            .until(
                EC.visibility_of_element_located(
                    (By.XPATH, f"//*[contains(text(), 'Probability')]")
                )
            )
            .text
        )
        self.assertRegex(
            text_after_classification, "(Probability:\s\d{1,2}\.\d{0,2}\%)+"
        )
        time.sleep(8)

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
