import { Card, Typography } from 'antd';

const { Paragraph, Link } = Typography;

export default function About() {
  return (
    <Card title='About'>
      <Paragraph>
        This bird classification application was prepared as a part of the bachelor thesis by Zofia Łągiewka, Piotr Sieczka and Jacek Zalewski at <Link href='https://ww2.mini.pw.edu.pl/'>the Faculty of Mathematics and Information Science</Link> of <Link href='https://www.pw.edu.pl/'>Warsaw University of Technology</Link>, under the supervision of <Link href='https://ajastrzebska.mini.pw.edu.pl/'>Agnieszka Jastrzębska, Ph.D., D.Sc.</Link>
      </Paragraph>
      <Paragraph>
        The data used for training the machine learning model comes from the <Link href='https://xeno-canto.org/'>xeno-canto</Link> database. The birds' photos comes from <Link href='https://commons.wikimedia.org/'>Wikimedia Commons</Link>.
      </Paragraph>
      <Paragraph>
        The application was created using <Link href='https://react.dev/'>React</Link> and <Link href='https://ant.design/'>Ant Design</Link>. Spectrograms are generated using <Link href='https://wavesurfer.xyz/'>wavesurfer.js</Link>. The machine learing model was creaated using <Link href='https://pytorch.org/'>PyTorch</Link> and <Link href='https://librosa.org/'>Librosa</Link>.
      </Paragraph>
    </Card>
  );
}