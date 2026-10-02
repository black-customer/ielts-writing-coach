import importlib.util
import pathlib
import tempfile
import unittest

project = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("build_site", project / "build_site.py")
build_site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_site)


class CacheFingerprintTests(unittest.TestCase):
    def test_same_release_with_changed_assets_gets_new_cache(self):
        with tempfile.TemporaryDirectory() as task_dir:
            source = pathlib.Path(task_dir) / "workbench.js"
            source.write_text("first version", encoding="utf-8")
            first = build_site.cache_stamp(task_dir, ["./", "workbench.js"], "1.2.0")
            source.write_text("fixed version", encoding="utf-8")
            second = build_site.cache_stamp(task_dir, ["./", "workbench.js"], "1.2.0")
            self.assertNotEqual(first, second)

    def test_order_independent_and_release_sensitive(self):
        with tempfile.TemporaryDirectory() as task_dir:
            for name in ["index.html", "style.css"]:
                (pathlib.Path(task_dir) / name).write_text(name, encoding="utf-8")
            a = build_site.cache_stamp(task_dir, ["index.html", "style.css"], "1.2.0")
            b = build_site.cache_stamp(task_dir, ["style.css", "index.html"], "1.2.0")
            c = build_site.cache_stamp(task_dir, ["style.css", "index.html"], "1.2.1")
            self.assertEqual(a, b)
            self.assertNotEqual(a, c)


if __name__ == "__main__":
    unittest.main()
