import os
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import time


class TestWholeApplication(unittest.TestCase):
    def setUp(self):
        self.URL = "http://localhost:5173/"
        self.filesLocation = os.path.dirname(os.path.abspath(__file__))
        chrome_options = webdriver.ChromeOptions()
        prefs = {
            "profile.default_content_setting_values.media_stream_mic": 1,
        }
        chrome_options.add_experimental_option("prefs", prefs)
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(5)
        self.driver.get(self.URL)

    def click_analyze_button(self):
        analyze_button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'Analyze')]")))
        time.sleep(2)
        analyze_button.click()

        WebDriverWait(self.driver, 10).until(EC.url_to_be(f"{self.URL}results"))

        text_after_classification = (WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, f"//*[contains(text(), '')]"))).text)

        return text_after_classification

    def test_check_recording(self):
        record_button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'record')]")))
        record_button.click()
        time.sleep(5)

        stop_button = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//button[contains(., 'Stop')]")))
        stop_button.click()

        text_after_click = WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, f"//*[contains(text(), 'To analyze the recording')]"))).text
        self.assertEqual(text_after_click, "To analyze the recording, select the relevant fragment using the slider below the spectrogram.")
        time.sleep(2)

        WebDriverWait(self.driver, 10).until(EC.url_to_be(f"{self.URL}choosing_fragment"))

        text_after_classification = self.click_analyze_button()
        self.assertRegex(text_after_classification, "(Probability:\s\d{1,2}\.\d{0,2}\%)+|(No\sbird)")
        time.sleep(3)

    def test_check_about(self):
        link = WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//a[contains(., 'About')]")))
        link.click()

        time.sleep(1)
        WebDriverWait(self.driver, 10).until(EC.url_to_be(f"{self.URL}about"))

        about_page = WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, f"//*[contains(text(), '')]"))).text
        self.assertRegex(about_page, "a\spart\sof\sthe\sbachelor\sthesis")
        time.sleep(1)

    def prepare_test_file_upload(self, filename, regex):
        file_input = self.driver.find_element(By.XPATH, "//input[@type='file']")
        file_input.send_keys(os.path.join(self.filesLocation, filename))

        text_after_classification = self.click_analyze_button()
        self.assertRegex(text_after_classification, regex)
        time.sleep(3)

    def test_correct_file_upload_1(self):
        self.prepare_test_file_upload('18848.mp3', "Buteo\sbuteo")

    def test_correct_file_upload_2(self):
        self.prepare_test_file_upload('64734.mp3', "Turdus\smerula")

    def test_long_file_upload(self):
        file_input = self.driver.find_element(By.XPATH, "//input[@type='file']")
        file_input.send_keys(os.path.join(self.filesLocation, '27236.mp3'))

        text_after_classification = (WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, f"//*[contains(text(), '')]"))).text)
        self.assertRegex(text_after_classification, 'Selection\shas\sto\sbe\sat\smost\s60\sseconds\slong')
        time.sleep(1)

    def test_short_file_upload(self):
        file_input = self.driver.find_element(By.XPATH, "//input[@type='file']")
        file_input.send_keys(os.path.join(self.filesLocation, '369598.mp3'))

        text_after_classification = text_after_classification = (WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, f"//*[contains(text(), '')]"))).text)
        self.assertRegex(text_after_classification, 'Selection\shas\sto\sbe\sat\sleast\s3\sseconds\slong')

        analyze_button = self.driver.find_element(By.XPATH, f"//button[contains(., 'Analyze')]")
        self.assertTrue(analyze_button.get_attribute("disabled"))
        time.sleep(1)

    def is_text_present(self, text):
        try:
            self.driver.find_element(By.XPATH, f"//*[contains(text(), '{text}')]")
            return True
        except:
            return False

    def test_choosing_fragment(self):
        file_input = self.driver.find_element(By.XPATH, "//input[@type='file']")
        file_input.send_keys(os.path.join(self.filesLocation, '27236.mp3'))
        time.sleep(1)

        left_handle = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'ant-slider-handle-1')))
        initial_left_position = left_handle.location['x']

        slider_handle = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'ant-slider-handle-2')))
        text_present = self.is_text_present("Selection has to be at most 60 seconds long")
        right_handle_position = slider_handle.location['x']
        
        while text_present and right_handle_position > initial_left_position:
            actions = ActionChains(self.driver)
            actions.click_and_hold(slider_handle).move_by_offset(-50, 0).release().perform()
            text_present = self.is_text_present("Selection has to be at most 60 seconds long")

        self.assertTrue(right_handle_position > initial_left_position)
        self.assertFalse(text_present)

        analyze_button = self.driver.find_element(By.XPATH, f"//button[contains(., 'Analyze')]")
        self.assertFalse(analyze_button.get_attribute("disabled"))
        time.sleep(1)

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
