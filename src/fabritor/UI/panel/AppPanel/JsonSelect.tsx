import { fabric } from 'fabric';
import { useSearchParams } from 'ice';
import AppSubPanel from './AppSubPanel';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { createImage } from '@/editor/objects/image';
import { createTextbox } from '@/editor/objects/textbox';
import { useContext, useEffect, useState,useRef} from 'react';
import { GloablStateContext } from '@/context';
import DEMOJSON1 from '@/assets/DEMO_eg1.json';
import DEMOJSON2 from '@/assets/DEMO_eg2.json';
import DEMOJSON3 from '@/assets/DEMO_eg3.json';
import DEMOJSON4 from '@/assets/DEMO_eg4.json';
import { useTranslation } from '@/i18n/utils';
import { GroupOutlined, HeartTwoTone } from '@ant-design/icons';
// import { Divider,Form,Button } from 'antd';
import { Button, Form, Input, InputNumber, QRCode, Radio, Collapse, Flex } from 'antd';
import ColorSetter from '@/fabritor/UI/setter/ColorSetter/Solid';
import { List, Empty,  Divider } from 'antd';
import { SKETCH_ID } from '@/utils/constants';
import ContextMenu from '@/fabritor/components/ContextMenu';

export default function LayoutPanel (props) {
  const { Item: FormItem } = Form;
  const { back } = props;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [QRCodeConfig, setQRCodeConfig] = useState({ value: 'fabritor' });
  const qrRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { isReady, setReady, object: activeObject, setActiveObject, editor } = useContext(GloablStateContext);
  const [layers, setLayers] = useState([]);


  const getCanvasLayers = (objects) => {
    const _layers: any = [];
    const length = objects.length;
    if (!length) {
      setLayers([]);
      return;
    }
    const activeObject = editor?.canvas.getActiveObject();
    for (let i = length - 1; i >= 0; i--) {
      let object = objects[i];
      if (object && object.id !== SKETCH_ID) {
        if (activeObject === object) {
          object.__cover = object.toDataURL();
        } else {
          if (!object.__cover) {
            object.__cover = object.toDataURL();
          }
        }

        _layers.push({
          cover: object.__cover,
          group: object.type === 'group',
          object
        });
      }
    }
    setLayers(_layers);
  }

  const loadDemo1 = async () => {
    setReady(false);
    await editor.loadFromJSON(DEMOJSON1, true);
    editor.fhistory.reset();
    setReady(true);
    setActiveObject(null);
    editor.fireCustomModifiedEvent();
  }
  const loadDemo2 = async () => {
    setReady(false);
    await editor.loadFromJSON(DEMOJSON2, true);
    editor.fhistory.reset();
    setReady(true);
    setActiveObject(null);
    editor.fireCustomModifiedEvent();
  }
  const loadDemo3 = async () => {
    setReady(false);
    await editor.loadFromJSON(DEMOJSON3, true);
    editor.fhistory.reset();
    setReady(true);
    setActiveObject(null);
    editor.fireCustomModifiedEvent();
  }
  const loadDemo4 = async () => {
    setReady(false);
    await editor.loadFromJSON(DEMOJSON4, true);
    editor.fhistory.reset();
    setReady(true);
    setActiveObject(null);
    editor.fireCustomModifiedEvent();
  }
  const handleItemClick = (item) => {
    editor.canvas.discardActiveObject();
    editor.canvas.setActiveObject(item.object);
    editor.canvas.requestRenderAll();
  }

  useEffect(() => {
    let canvas;
    const initCanvasLayers = () => { getCanvasLayers(canvas.getObjects()); }

    if (isReady) {
      setLayers([]);
      canvas = editor?.canvas;
      initCanvasLayers();

      canvas.on({
        'object:added': initCanvasLayers,
        'object:removed': initCanvasLayers,
        'object:modified': initCanvasLayers,
        'object:skewing': initCanvasLayers,
        'fabritor:object:modified': initCanvasLayers
      });
    }

    return () => {
      if (canvas) {
        canvas.off({
          'object:added': initCanvasLayers,
          'object:removed':initCanvasLayers,
          'object:modified': initCanvasLayers,
          'object:skewing': initCanvasLayers,
          'fabritor:object:modified': initCanvasLayers
        });
      }
    }
  }, [isReady]);

  return (
    <div
      className="fabritor-panel-wrapper"
    >
      {
        layers.length ? 
        <List
          dataSource={layers}
          renderItem={(item: any) => (
            <ContextMenu object={item.object} noCareOpen>
              <List.Item
                className="fabritor-list-item"
                style={{
                  border: activeObject === item.object ? ' 2px solid #ff2222' : '2px solid transparent',
                  padding: '10px 16px'
                }}
                onClick={() => { handleItemClick(item) }}
              >
                <Flex justify="space-between" align="center" style={{ width: '100%', height: 40 }}>
                  <img src={item.cover} style={{ maxWidth: 200, maxHeight: 34 }} />
                  {
                    item.group ?
                    <GroupOutlined style={{ fontSize: 18, color: 'rgba(17, 23, 29, 0.6)' }} /> : null
                  }
                </Flex>
              </List.Item>
            </ContextMenu>
          )}
        /> :
        <Empty
          image={null}
          description={
            <div>
              {/* <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: 40 }} /> */}
              <p style={{ color: '#aaa', fontSize: 16 }}>{t('panel.design.layout_start')}</p>
              <Divider />
              <Button onClick={loadDemo1}>{t('panel.design.DEMO1')}</Button>
              <Button onClick={loadDemo2}>{t('panel.design.DEMO2')}</Button>
              <Button onClick={loadDemo3}>{t('panel.design.DEMO3')}</Button>
              <Button onClick={loadDemo4}>{t('panel.design.DEMO4')}</Button>
            </div>
          }
        />
      }
    </div>
  )
}