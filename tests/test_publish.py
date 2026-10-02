import base64
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('publish_api',Path(__file__).resolve().parents[1]/'push-via-api.py')
publish=importlib.util.module_from_spec(spec)
spec.loader.exec_module(publish)

class PublishSafetyTests(unittest.TestCase):
    def setup_publish(self, remote_changed=False):
        content=b'new content';archive=io.BytesIO()
        with tarfile.open(fileobj=archive,mode='w') as out:
            info=tarfile.TarInfo('file.txt');info.size=len(content);out.addfile(info,io.BytesIO(content))
        calls=[];refs=0
        expected=hashlib.sha1(b'blob 11\0'+content).hexdigest()
        def command(args):
            if args[1]=='status':return b''
            if args[1]=='rev-parse':return b'local-commit\n'
            if 'archive' in args:return archive.getvalue()
            if args[1]=='ls-tree':return f'100644 blob {expected}\tfile.txt\0'.encode()
            raise AssertionError(args)
        def gh(endpoint,method='GET',payload=None):
            nonlocal refs
            calls.append((endpoint,method,payload))
            if '/git/ref/' in endpoint:
                refs+=1
                return {'object':{'sha':'other-parent' if remote_changed and refs==2 else 'parent'}}
            if method=='GET' and '/git/trees/' in endpoint:return {'sha':'remote-tree','tree':[{'path':'remote-only.txt','type':'blob','sha':'kept'}]}
            if endpoint.endswith('/blobs'):
                self.assertEqual(base64.b64decode(payload['content']),content)
                return {'sha':expected}
            if endpoint.endswith('/trees'):return {'sha':'new-tree'}
            if endpoint.endswith('/commits'):return {'sha':'new-commit'}
            if method=='PATCH':return {}
            raise AssertionError(endpoint)
        return calls,command,gh

    def test_content_hash_replaces_same_size_cache_and_preserves_remote_tree(self):
        calls,command,gh=self.setup_publish()
        with tempfile.TemporaryDirectory() as task_dir:
            cache=Path(task_dir)/'cache.json';cache.write_text(json.dumps({'file.txt':{'sha':'stale','size':11}}))
            with patch.object(publish,'CACHE',cache),patch.object(publish.subprocess,'check_output',side_effect=command),patch.object(publish,'gh',side_effect=gh):publish.publish()
        self.assertTrue(any(endpoint.endswith('/blobs') for endpoint,_,_ in calls))
        tree=next(payload for endpoint,method,payload in calls if endpoint.endswith('/trees'))
        self.assertEqual(tree['base_tree'],'remote-tree')
        commit=next(payload for endpoint,_,payload in calls if endpoint.endswith('/commits'))
        self.assertEqual(commit['parents'],['parent'])
        update=next(payload for _,method,payload in calls if method=='PATCH')
        self.assertFalse(update['force'])

    def test_remote_race_stops_before_publishing(self):
        calls,command,gh=self.setup_publish(remote_changed=True)
        with tempfile.TemporaryDirectory() as task_dir:
            with patch.object(publish,'CACHE',Path(task_dir)/'cache.json'),patch.object(publish.subprocess,'check_output',side_effect=command),patch.object(publish,'gh',side_effect=gh):
                with self.assertRaisesRegex(RuntimeError,'Remote main changed'):publish.publish()
        self.assertFalse(any(method=='PATCH' for _,method,_ in calls))

    def test_dry_run_has_no_remote_writes(self):
        calls,command,gh=self.setup_publish()
        with patch.object(publish.subprocess,'check_output',side_effect=command),patch.object(publish,'gh',side_effect=gh):publish.publish(dry_run=True)
        self.assertTrue(all(method=='GET' for _,method,_ in calls))

if __name__=='__main__':unittest.main()
